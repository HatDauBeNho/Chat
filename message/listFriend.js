const token = localStorage.getItem("token");
const friendsList = $("#friends");
const getUser = $("#getUser");
const getAllMessage = $("#messages");
const messageForm = $("#messageForm");
const message = $("#message");
let listIcon = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😶', '😏', '😒', '🙄', '😬', '😮‍💨', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶'];
const reversedIcons = listIcon.reverse();

let customFriend={};
let arrListFriend=[];
let arrStorageMessage=[];


var myHeaders = { Authorization: `Bearer ${token}` };

$(document).ready(function () {
  if (token==null) window.location.href="/login.html";
  else
  {
    getUserInfor();
    getListFriend();
    filterFriend();
  }
  
});
setInterval(function() {
  getMessages(customFriend);
}, 10000);
//click ban be
$(document).on("click", ".left-container-channel", function() 
{
  let friendid= $(this).attr("id");
  let friend= arrListFriend.find(({ FriendID }) => FriendID == friendid)
  getFriendInfor(friend);
  customFriend=friend;   
  $(".list-friend-message").remove();
  $(".list-my-message").remove();
  getMessages(customFriend)
  $(".left-container-channel").removeClass("active");
  $(this).addClass("active");
  
  //luu tru tin nhan vao client
  arrStorageMessage.empty();
  getMessages(customFriend).forEach(mess => {
  arrStorageMessage.push(mess);
  });
});
$("#logout").click(function() {
    localStorage.clear();
    window.location.href = "/auth/login.html";
});
$("#btnSendMessage").click(function()
  {        
    if ($('.message-input').val()!='')
      {
        arrStorageMessage.push()
        getAllMessage.empty();   
        renderMessage(customFriend,arrStorageMessage);    
        setTimeout(() => {
          actionSendMessage(customFriend.FriendID,$('.message-input').val());
        }, 2000);
        $('.message-input').val('');
      } 
});
$(".message-input").keydown(function(event){
  if(event.keyCode == 13&&$('.message-input').val()!='') { 
      event.preventDefault(); 
      getAllMessage.empty();
     actionSendMessage(customFriend.FriendID,$('.message-input').val());
      $('.message-input').val('');
  }
});

$('#btnChooseFile').click(function() 
{
  $('#fileInput').click();
});

$('#fileInput').change(function() {
  let file = this.files[0]; 
  if (file) {
      if (confirm('bạn có muốn gửi: ' + file.name))
        actionSendMessage(customFriend.FriendID,"Gửi file",file);
  }
});

          reversedIcons.forEach(function(icon) {
              $('.list-emo').append(
                  $('<div>').addClass('emo-icon').text(icon).click(function() {
                    var currentText = $('#message').val();
                    var newText = currentText + icon;
                    $('#message').val(newText);
                  })
              );
          });
$('.send-emo-icon').click(function() 
{
  $('.list-emo').toggleClass('show');
});

$(document).on("click", ".my-file", function() 
{
  let urlFile= $(this).attr("urlFile");
  downloadFile(urlFile);
});
$(document).on("click", ".friend-file", function() 
{
  let urlFile= $(this).attr("urlFile");
  downloadFile(urlFile);
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
        let avatarUrl = result.data.Avatar ? "http://10.2.44.52:8888/api/images" + result.data.Avatar : "/images/defaultavatar.jpg";
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
      arrListFriend=result.data;
      result.data.forEach((friend) => 
      {
        const listItem = $("<div>").addClass("left-container-channel").attr("id",friend.FriendID);

        const avatar = $("<img>").addClass("avatar");
        let avatarUrl = friend.Avatar ? "http://10.2.44.52:8888/api/images" + friend.Avatar : "/images/defaultavatar.jpg";
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
      $(".left-container-channel").first().click();
    },error: function (error) {
      console.log("error: ", error);
    }
  });
  
}

function getFriendInfor(friend) {
  const userInfor = $(".right-container-header");
  if (userInfor.length > 0) 
    {
      let avatarUrl = friend.Avatar ? "http://10.2.44.52:8888/api/images" + friend.Avatar : "/images/defaultavatar.jpg";
      userInfor.find(".right-friend-avatar").attr("src", avatarUrl);
      userInfor.find(".right-friend-username").text(friend.FullName);
      if (friend.isOnline) $(".status-icon").show()
        else $(".status-icon").hide();
      userInfor.find(".right-friend-status").text(friend.isOnline ? "Online" : "Offline");     
  }
  else {
    const userInfor = $("<div>").addClass("right-container-header");

    const avatarContainer = $("<div>").addClass("avatar-container");
    const statusIcon = $("<img>").addClass("status-icon").attr("src", "/images/Online.png");
    
    let avatarUrl = friend.Avatar ? "http://10.2.44.52:8888/api/images" + friend.Avatar : "/images/defaultavatar.jpg";
    const avatar = $("<img>").addClass("right-friend-avatar").attr("src", avatarUrl);
    avatarContainer.append(statusIcon );
    avatarContainer.append(avatar);
     if (friend.isOnline) $(".status-icon").show()
      else $(".status-icon").hide();

    userInfor.append(avatarContainer);

    const detailDiv = $("<div>").addClass("right-friend-infor");

    const fullName = $("<h3>").addClass("right-friend-username").text(friend.FullName);
      
      
    detailDiv.append(fullName);

    const status = $("<p>").text(friend.isOnline ? "Online" : "Offline").addClass("right-friend-status");
      
      
    detailDiv.append(status);

    userInfor.append(detailDiv);
    getUser.append(userInfor);
  }
}

function actionSendMessage( FriendID, Content,Files) {
  if (Content!='')
    {
      var formData = new FormData();
      formData.append("FriendID", FriendID);
      formData.append("Content", Content);
      formData.append("files",Files);
      $.ajax({
        url: "http://10.2.44.52:8888/api/message/send-message",
        type: "POST",
        headers: myHeaders,
        processData: false,
        contentType: false,
        data:formData,
        success: function(result) 
        {
          console.log(result);
          // messageStatus=true;
          getMessages(customFriend);
        },
        error: function(error) {
          console.error("Error:", error);
          // messageStatus=false;

        }
      });
    }else  getMessages(customFriend);

 
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
function renderMessage(friend,arrMess)
{
  getAllMessage.empty();
  if (arrMess.data.length==0)
    {
    const listMessage = $("<div>");
    const emptyMessage=$("<img>").addClass("empty-message-img").attr("src", "/images/empty-list-message.png");
    listMessage.append(emptyMessage);
    getAllMessage.append(listMessage);
  }   
  else{
    let flag=-1;
    for (let i=0;i<arrMess.data.length;i++)
      {
        if (i<=flag) 
        {
          continue;
        } 
        else
        {

          const listMessage = $("<div>");
          if (arrMess.data[i].MessageType == 0) {
              listMessage.addClass("list-friend-message");
      
              let avatarUrl = friend.Avatar ? "http://10.2.44.52:8888/api/images" + friend.Avatar :"images/defaultavatar.jpg";
              const avatar = $("<img>").addClass("avatar-message").attr("src", avatarUrl);
              listMessage.append(avatar);
  
              const friendMessage=$("<div>").addClass("friend-messages");

              for (let j=i;j<arrMess.data.length;j++)
              {
                if (arrMess.data[j].Files.length>0) 
                  {
                    const file=$("<div>").addClass("friend-file").attr("urlFile",arrMess.data[j].Files[0].urlFile);
                    const fileImage = $("<img>").addClass("file-image").attr("src", "/images/file-icon.svg");
                    const fileName=$("<p>").addClass("file-name").text(arrMess.data[j].Files[0].FileName);
                    file.append(fileImage);
                    file.append(fileName);
                    friendMessage.append(file);
                  }

                const content = $("<p>").addClass("friend-message").text(arrMess.data[j].Content);
                friendMessage.append(content);
                  
                if (j==arrMess.data.length-1) break;
                else{
                  let startTime = moment(arrMess.data[j].CreatedAt);
                  let endTime = moment(arrMess.data[j+1].CreatedAt);
                  if (startTime.isSame(endTime, "hour") && startTime.isSame(endTime, "minute")&&arrMess.data[j+1].MessageType==0 )
                  {
                    flag=j+1;
                  } else break;
                }
                
              }
              let formattedTime = moment(arrMess.data[i].CreatedAt).format('hh:mm A');

              const sendTime=$("<p>").addClass("send-time-friend-message").text(formattedTime);
              friendMessage.append(sendTime);
              listMessage.append(friendMessage);
  
  
              const func=$("<div>").addClass("function");
  
              const btnReaction=$("<button>").addClass("btn-reaction");
              const reactionImg = $("<img>").addClass("reaction-img").attr("src", "/images/reaction.png");
              btnReaction.append(reactionImg);
              func.append(btnReaction);
  
  
              const btnFunction=$("<button>").addClass("btn-function");
              const functionImg = $("<img>").addClass("function-img").attr("src", "/images/Menu.png");
              btnFunction.append(functionImg);
              func.append(btnFunction);
  
              listMessage.append(func);
  
              getAllMessage.append(listMessage);
              
          } else {
            const func=$("<div>").addClass("function");
  
            const btnReaction=$("<button>").addClass("btn-reaction");
            const reactionImg = $("<img>").addClass("reaction-img").attr("src", "/images/reaction.png");
            btnReaction.append(reactionImg);
            func.append(btnReaction);
  
            listMessage.append(func);
  
  
            const btnFunction=$("<button>").addClass("btn-function");
            const functionImg = $("<img>").addClass("function-img").attr("src", "/images/Menu.png");
            btnFunction.append(functionImg);
            func.append(btnFunction);
  
            const myMessage=$("<div>").addClass("my-messages");
            // if (!messageStatus)   $(".my-messages").addClassClass("active");
            // else $(".my-messages").removeClass("active");
 
            for (let j=i;j<arrMess.data.length;j++)
              {
                if (arrMess.data[j].Files.length>0) 
                {
                  const file=$("<div>").addClass("my-file").attr("urlFile",arrMess.data[j].Files[0].urlFile);
                  const fileImage = $("<img>").addClass("file-image").attr("src", "/images/file-icon.svg");
                  const fileName=$("<p>").addClass("file-name").text(arrMess.data[j].Files[0].FileName);
                  file.append(fileImage);
                  file.append(fileName);
                  myMessage.append(file);
                }
                if (arrMess.data[j].Images.length>0)
                {
                  const showImage=$("<img>").addClass("show-image").attr("src", "http://10.2.44.52:8888/api"+arrMess.data[j].Images[0].urlImage);
                  myMessage.append(showImage);
                }
                const content = $("<p>").addClass("my-message").text(arrMess.data[j].Content);
                myMessage.append(content);
                if (j==arrMess.data.length-1) break;
                else{
                  let startTime = moment(arrMess.data[j].CreatedAt);
                  let endTime = moment(arrMess.data[j+1].CreatedAt);
                  if ((startTime.isSame(endTime, "hour") && startTime.isSame(endTime, "minute"))&&arrMess.data[j+1].MessageType==1)
                  {
                    flag=j+1;
                   } else {
                    break;
                  }
                }
                
              }
              listMessage.addClass("list-my-message");
  
              let formattedTime = moment(arrMess.data[i].CreatedAt).format('hh:mm A');
              const check=$("<div>").addClass("check");
              const checkIcon=$("<img>").addClass("check-icon").attr("src","/images/Check all.png")
              const sendTime=$("<p>").addClass("send-time-my-message").text(formattedTime);
              check.append(checkIcon);
              check.append(sendTime);
              myMessage.append(check);
              
              listMessage.append(myMessage);
  
  
              getAllMessage.append(listMessage);
          }
        }
        
      };
  }

  $('.list-message').scrollTop($('.list-message')[0].scrollHeight);
}

function filterFriend()
{
  $('#search-input').on("keyup",function(){
    var value = $(this).val().toLowerCase();
    $("#friends .left-container-channel").filter(function() 
    {
      var text = $(this).find(".h4content").text().toLowerCase();
      $(this).toggle(text.indexOf(value) > -1);
    });
  });
}
function downloadFile(urlFile)
{
  $.ajax({
    url: "http://10.2.44.52:8888/api" + urlFile,
    method:"GET",
    success: function (result) 
    {
      var link = document.createElement("a");
      link.href = "http://10.2.44.52:8888/api" + urlFile;
      link.target = "_blank"; 
      link.click();
    },
    error: function (error) {
      console.log("error: ", error);
    }
  });
}


