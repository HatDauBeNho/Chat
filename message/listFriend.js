const token = localStorage.getItem("token");
const friendsList = $("#friends");
const getUser = $("#getUser");
const getAllMessage = $("#messages");
const messageForm = $("#messageForm");
const btnLogout = $("#logout");
const message = $("#message");
const btnSendMessage = $("#btnSendMessage");
let customFriend={};

var myHeaders = { Authorization: `Bearer ${token}` };

$(document).ready(function () {
  if (token==null) window.location.href="/login.html";
  else
  {
    getUserInfor();
    getListFriend();
  }
  
});
$(document).on("click", ".left-container-channel", function(event) 
{
    if ($(event.target).hasClass("left-container-channel")) 
    {
      const friend = $(event.target).data("friend");
      friendClick(JSON.parse(friend));
      $(".list-friend-message").remove();
      $(".list-my-message").remove();
      getMessages(JSON.parse(friend));
      customFriend=JSON.parse(friend);   
   
  }
  $(".left-container-channel").removeClass("active");
  $(this).addClass("active");
});

// su kien click ban be 

btnLogout.click(function() {
    localStorage.clear();
    window.location.href = "/login.html";
  });
function getUserInfor() {
  $.ajax({
    url: "http://10.2.44.52:8888/api/user/info",
    method: "GET",
    contentType: "application/json",
    headers: myHeaders,
    success: function (result) {
      if (result.status == 1) {
        $("#fullName").text(result.data.FullName);
        let avatarUrl = result.data.Avatar ? "http://10.2.44.52:8888/api/images" + result.data.Avatar : "/message/images/defaultavatar.jpg";
        $("#avatar").attr("src", avatarUrl);
      } else console.log("loi: ", result.message);
    },
    error: function (error) {
      console.log("error: ", error);
    },
  });
}
function getListFriend() 
{
  //lấy danh sách bạn bè
  $.ajax({
    url: "http://10.2.44.52:8888/api/message/list-friend",
    method: "GET",
    contentType: "application/json",
    headers: myHeaders,
    success: function (result) 
    {
      let index=0
      result.data.forEach((friend) => 
      {
        index++;
        const listItem = $("<div>").addClass("left-container-channel").attr('index',index);
        $(listItem).data('friend', JSON.stringify(friend));

        const avatar = $("<img>").addClass("avatar");
        let avatarUrl = friend.Avatar ? "http://10.2.44.52:8888/api/images" + friend.Avatar : "/message/images/defaultavatar.jpg";
        avatar.attr("src", avatarUrl);
        listItem.append(avatar);

        const friendInfo = $("<div>").addClass("left-container-channel-infor");



        const fullName = $("<h4>").addClass("h4content").text(friend.FullName);
        const lastMessage=$("<p>").addClass("content").text(friend.Content);
        friendInfo.append(fullName);
        friendInfo.append(lastMessage);
        
        listItem.append(friendInfo);

        friendsList.append(listItem);

      
      });
      // Gọi hàm click trên phần tử đầu tiên để hiển thị friend
      $(".left-container-channel[index='1']").click();
    },error: function (error) {
      console.log("error: ", error);
    }
  });
  
}
function getMessages(friend)
{
  $.ajax({
    url: "http://10.2.44.52:8888/api/message/get-message?FriendID=" + friend.FriendID,
    method:"GET",
    contentType: "application/json",
    headers: myHeaders, 
    success: function (result) 
    {
      renderMessage(friend,result);
    },
    error: function (error) {
      console.log("error: ", error);
    }
  });
  
}
function friendClick(friend) {
  const userInfor = $(".right-container-header");
  if (userInfor.length > 0) 
    {
      let avatarUrl = friend.Avatar ? "http://10.2.44.52:8888/api/images" + friend.Avatar : "/message/images/defaultavatar.jpg";
      userInfor.find(".right-friend-avatar").attr("src", avatarUrl);
      userInfor.find(".right-friend-username").text(friend.FullName);
      userInfor.find(".right-friend-status").text(friend.isOnline ? "Online" : "Offline");     
  } else {
    const userInfor = $("<div>").addClass("right-container-header");
    let avatarUrl = friend.Avatar ? "http://10.2.44.52:8888/api/images" + friend.Avatar : "/message/images/defaultavatar.jpg";
    const avatar = $("<img>")
      .addClass("right-friend-avatar")
      .attr("src", avatarUrl);
    userInfor.append(avatar);

    const detailDiv = $("<div>").addClass("right-friend-infor");

    const fullName = $("<h3>")
      .addClass("right-friend-username")
      .text(friend.FullName);
    detailDiv.append(fullName);

    const status = $("<p>")
      .text(friend.isOnline ? "Online" : "Offline")
      .addClass("right-friend-status");
    detailDiv.append(status);

    userInfor.append(detailDiv);
    getUser.append(userInfor);
  }
}
var myHeaders = { Authorization: `Bearer ${token}` };

function actionSendMessage( FriendID, Content) {
  var formData = new FormData();
  formData.append("FriendID", FriendID);
  formData.append("Content", Content);
  $.ajax({
    url: "http://10.2.44.52:8888/api/message/send-message",
    type: "POST",
    headers: myHeaders,
    processData: false,
    contentType: false,
    data:formData,
    success: function(result) {
      getMessages(customFriend);
    },
    error: function(error) {
      console.error("Error:", error);
    }
  });
}

function renderMessage(friend,result)
{
  getAllMessage.empty();
  if (result.data.length==0)
    {
    const listMessage = $("<div>");
    const emptyMessage=$("<img>").addClass("empty-message-img").attr("src", "/message/images/empty-list-message.png");
    listMessage.append(emptyMessage);
    getAllMessage.append(listMessage);
  }   
  else{
    result.data.forEach((message) => 
      {
        const listMessage = $("<div>");
        if (message.MessageType == 0) {
            listMessage.addClass("list-friend-message");
    
            let avatarUrl = friend.Avatar ? "http://10.2.44.52:8888/api/images" + friend.Avatar : "/message/images/defaultavatar.jpg";
            const avatar = $("<img>").addClass("avatar-message").attr("src", avatarUrl);
            listMessage.append(avatar);
    
            const content = $("<p>").addClass("friend-message").text(message.Content);
            listMessage.append(content);

            let formattedTime = moment(message.CreatedAt).format('hh:mm A');
            const sendTime=$("<p>").addClass("send-time-friend-message").text(formattedTime);
            listMessage.append(sendTime);

            getAllMessage.append(listMessage);
        } else {
            listMessage.addClass("list-my-message");
            const content = $("<p>").addClass("my-message").text(message.Content);
            listMessage.append(content);

            let formattedTime = moment(message.CreatedAt).format('hh:mm A');
            const sendTime=$("<p>").addClass("send-time-my-message").text(formattedTime);
            listMessage.append(sendTime);

            getAllMessage.append(listMessage);
        }
      });
  }
  
}

btnSendMessage.click(function(){        
  getAllMessage.empty();
  actionSendMessage(customFriend.FriendID,$('.message-input').val());
  $('.message-input').val('');
});