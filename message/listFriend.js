const token = localStorage.getItem("token");
const friendsList = $("#friends");
const getUser = $("#getUser");
const getAllMessage = $("#messages");
const messageForm = $("#messageForm");
const btnLogout = $("#logout");
const message = $("#message");
const btnSendMessage = $("#btnSendMessage");

var myHeaders = { Authorization: `Bearer ${token}` };

$(document).ready(function () {
  if (token==null) window.location.href="/login.html";
  else
  {
    getUserInfor();
    getListFriend();
  }
});
//su kien click ban be 
$(document).on("click", ".left-container-channel", function(event) 
{
  if ($(event.target).hasClass("left-container-channel")) {
      const friend = $(event.target).data("friend");
      friendClick(JSON.parse(friend));
      $(".list-friend-message").remove();
      $(".list-my-message").remove();
      getMessages(JSON.parse(friend));
      btnSendMessage.click(function(){
        console.log("adubaby");
        
        console.log(JSON.parse(friend).FriendID,message.find('[name="message"]').val());    
        actionSendMessage(JSON.parse(friend),message.find('[name="message"]').val());   
      });
  }
  $(".left-container-channel").removeClass("active");
  $(this).addClass("active");
  
});
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
        $("#avatar").attr("src","http://10.2.44.52:8888/api/images" + result.data.Avatar);

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
      result.data.forEach((friend) => 
      {
        const listItem = $("<div>").addClass("left-container-channel");
        $(listItem).data('friend', JSON.stringify(friend));

        const avatar = $("<img>").addClass("avatar");
        avatar.attr("src", "http://10.2.44.52:8888/api/images" + friend.Avatar);
        listItem.append(avatar);

        const friendInfo = $("<div>").addClass("left-container-channel-infor");

        const fullName = $("<h4>").addClass("h4content").text(friend.FullName);
        friendInfo.append(fullName);
        listItem.append(friendInfo);

        friendsList.append(listItem);

        $.ajax({
          url: "http://10.2.44.52:8888/api/message/get-message?FriendID=" + friend.FriendID,
          method:"GET",
          contentType: "application/json",
          headers: myHeaders, 
          success: function (result) 
          {
            const lastMessage=$("<p>").addClass("content");
            if (result.data[result.data.length-1].MessageType==0)
            {
                lastMessage.text(result.data[result.data.length - 1].Content);
            }else 
            {
              lastMessage.text("You:"+result.data[result.data.length - 1].Content);
            }
            friendInfo.append(lastMessage);
          },
          error: function (error) {
            console.log("error: ", error);
          }
        });
      });
      // Gọi hàm click trên phần tử đầu tiên để hiển thị friend
       $(".left-container-channel").first().click();
    },error: function (error) {
      console.log("error: ", error);
    }
  });
  
}



//
function getMessages(friend)
{
  $.ajax({
    url: "http://10.2.44.52:8888/api/message/get-message?FriendID=" + friend.FriendID,
    method:"GET",
    contentType: "application/json",
    headers: myHeaders, 
    success: function (result) 
    {
      result.data.forEach((message) => {
        const listMessage = $("<div>");
        if (message.MessageType == 0) {
            listMessage.addClass("list-friend-message");
    
            const avatar = $("<img>").addClass("avatar-message").attr("src", "http://10.2.44.52:8888/api/images" + friend.Avatar);
            listMessage.append(avatar);
    
            const content = $("<p>").addClass("friend-message").text(message.Content);
            listMessage.append(content);
    
            getAllMessage.append(listMessage);
        } else {
            listMessage.addClass("list-my-message");
            const content = $("<p>").addClass("my-message").text(message.Content);
            listMessage.append(content);
    
            getAllMessage.append(listMessage);
        }
    });
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
    userInfor
      .find(".right-friend-avatar")
      .attr("src", "http://10.2.44.52:8888/api/images" + friend.Avatar);
    userInfor.find(".right-friend-username").text(friend.FullName);
    userInfor
      .find(".right-friend-status")
      .text(friend.isOnline ? "Online" : "Offline");
  } else {
    const userInfor = $("<div>").addClass("right-container-header");

    const avatar = $("<img>")
      .addClass("right-friend-avatar")
      .attr("src", "http://10.2.44.52:8888/api/images" + friend.Avatar);
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

function actionSendMessage(FriendID, Content) {
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
      console.log("result", result);
    },
    error: function(error) {
      console.error("Error:", error);
    }
  });
}

