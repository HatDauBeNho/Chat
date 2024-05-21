const token = localStorage.getItem("token");
const friendsList = $("#friends");
const getUser = $("#getUser");
const getAllMessage = $("#messages");
const messageForm = $("#messageForm");
const message = $("#message");
const domain="http://localhost:8888/api";
let messageError = "";
let checkStatus = false;
let listIcon = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "🤣",
  "😂",
  "🙂",
  "🙃",
  "😉",
  "😊",
  "🥰",
  "😍",
  "🤩",
  "😘",
  "😗",
  "😚",
  "😙",
  "😋",
  "😛",
  "😜",
  "🤪",
  "😝",
  "🤑",
  "🤗",
  "🤭",
  "🤫",
  "🤔",
  "🤐",
  "🤨",
  "😐",
  "😑",
  "😶",
  "😶",
  "😏",
  "😒",
  "🙄",
  "😬",
  "😮‍💨",
  "🤥",
  "😌",
  "😔",
  "😪",
  "🤤",
  "😴",
  "😷",
  "🤒",
  "🤕",
  "🤢",
  "🤮",
  "🤧",
  "🥵",
  "🥶",
];
const reversedIcons = listIcon.reverse();

let customFriend = {};
let arrListFriend = [];
let arrStorageMessage = [];

var myHeaders = { Authorization: `Bearer ${token}` };

$(document).ready(function () {
  if (token == null) window.location.href = "/login.html";
  else {
    getUserInfor();
    getListFriend();
    filterFriend();
  }
});
setInterval(function () {
  getMessages(customFriend);
}, 10000);
//click ban be
$(document).on("click", ".left-container-channel", function () {
  let friendid = $(this).attr("id");
  let friend = arrListFriend.find(({ FriendID }) => FriendID == friendid);
  getFriendInfor(friend);
  customFriend = friend;
  $(".list-friend-message").remove();
  $(".list-my-message").remove();

  getMessages(customFriend);
  $(".left-container-channel").removeClass("active");
  $(this).addClass("active");
  arrStorageMessage.length = 0;
});
$("#logout").click(function () {
  localStorage.clear();
  window.location.href = "/auth/login.html";
});

$("#btnSendMessage").click(async function (event) {
  if ($(".message-input").val() != "") 
  {
    event.preventDefault();
    getAllMessage.empty();
    let input = $(".message-input").val();
    statusMessage(input);
    let result = { status: 0, data: arrStorageMessage, message: "" };
    renderMessage(customFriend, result);
    $(".message-input").val("");
    await actionSendMessage(customFriend.FriendID, input);
    renderMessage(customFriend, result);
  }
});

$(".message-input").keydown(async function (event) {
  if (event.keyCode == 13 && $(".message-input").val() != "") {
    event.preventDefault();
    getAllMessage.empty();
    let input = $(".message-input").val();
    statusMessage(input);
    let result = { status: 0, data: arrStorageMessage, message: "" };
    renderMessage(customFriend, result);
    $(".message-input").val("");
    await actionSendMessage(customFriend.FriendID, input);
    renderMessage(customFriend, result);
  }
});

$("#btnChooseFile").click(function () {
  $("#fileInput").click();
});

$("#fileInput").change(async function () {
  let file = this.files[0];
  if (file) {
    if (confirm("bạn có muốn gửi: " + file.name)) {
      let input = file;
      statusFile(input);
      let result = { status: 0, data: arrStorageMessage, message: "" };
      renderMessage(customFriend, result);
      await actionSendMessage(customFriend.FriendID, "", input);
      renderMessage(customFriend, result);
    }
  }
});
function statusMessage(mess) {
  arrStorageMessage.push({
    id: "",
    Content: mess,
    Files: [],
    Images: [],
    isSend: 0,
    CreatedAt: "",
    MessageType: 1,
  });
}
function statusFile(file) {
  arrStorageMessage.push({
    id: "",
    Content: "",
    Files: [file],
    Images: [],
    isSend: 0,
    CreatedAt: "",
    MessageType: 1,
  });
}
reversedIcons.forEach(function (icon) {
  $(".list-emo").append(
    $("<div>")
      .addClass("emo-icon")
      .text(icon)
      .click(function () {
        var currentText = $("#message").val();
        var newText = currentText + icon;
        $("#message").val(newText);
      })
  );
});
$(".send-emo-icon").click(function () {
  $(".list-emo").toggleClass("show");
});

$(document).on("click", ".my-file", function () {
  let urlFile = $(this).attr("urlFile");
  downloadFile(urlFile);
});
$(document).on("click", ".friend-file", function () {
  let urlFile = $(this).attr("urlFile");
  downloadFile(urlFile);
});

function getUserInfor() {
  $.ajax({
    url: domain+ "/user/info",
    method: "GET",
    contentType: "application/json",
    headers: myHeaders,
    success: function (result) {
      if (result.status == 1) {
        $("#fullName").text(result.data.FullName);
        let avatarUrl = result.data.Avatar
          ? domain+"/images" + result.data.Avatar
          : "/images/defaultavatar.jpg";
        $("#avatar").attr("src", avatarUrl);
      } else console.log("loi: ", result.message);
    },
    error: function (error) {
      console.log("error: ", error);
    },
  });
}

function getListFriend() {
  //lấy danh sách bạn bè
  $.ajax({
    url: domain+"/message/list-friend",
    method: "GET",
    contentType: "application/json",
    headers: myHeaders,
    success: function (result) {
      let index=0;
      result.data.forEach((friend) => {
        index++;
        if (friend.FullName!=null) 
        {
          console.log("bdu");
          arrListFriend.push(friend);
          const listItem = $("<div>").addClass("left-container-channel").attr("id", friend.FriendID);
          const avatar = $("<img>").addClass("avatar");
          let avatarUrl = friend.Avatar? domain+"/images" + friend.Avatar: "/images/defaultavatar.jpg";
          avatar.attr("src", avatarUrl);
          listItem.append(avatar);
  
          const friendInfo = $("<div>").addClass("left-container-channel-infor");
          const fullName = $("<h4>").addClass("h4content").text(friend.FullName);
          const lastMessage = $("<p>").addClass("content").text(friend.Content);
          friendInfo.append(fullName);
          friendInfo.append(lastMessage);
  
          listItem.append(friendInfo);
  
          friendsList.append(listItem);
        }else(console.log("adu"));
        
      });
      console.log(index);
      // Gọi hàm click trên phần tử đầu tiên để hiển thị friend
      $(".left-container-channel").first().click();
    },
    error: function (error) {
      console.log("error: ", error);
    },
  });
}

function getFriendInfor(friend) {
  const userInfor = $(".right-container-header");
  if (userInfor.length > 0) {
    let avatarUrl = friend.Avatar
      ? domain+ "/images" + friend.Avatar
      : "/images/defaultavatar.jpg";
    userInfor.find(".right-friend-avatar").attr("src", avatarUrl);
    userInfor.find(".right-friend-username").text(friend.FullName);
    if (friend.isOnline) $(".status-icon").show();
    else $(".status-icon").hide();
    userInfor
      .find(".right-friend-status")
      .text(friend.isOnline ? "Online" : "Offline");
  } else {
    const userInfor = $("<div>").addClass("right-container-header");

    const avatarContainer = $("<div>").addClass("avatar-container");
    const statusIcon = $("<img>")
      .addClass("status-icon")
      .attr("src", "/images/Online.png");

    let avatarUrl = friend.Avatar
      ? domain+"/images" + friend.Avatar
      : "/images/defaultavatar.jpg";
    const avatar = $("<img>")
      .addClass("right-friend-avatar")
      .attr("src", avatarUrl);
    avatarContainer.append(statusIcon);
    avatarContainer.append(avatar);
    if (friend.isOnline) $(".status-icon").show();
    else $(".status-icon").hide();

    userInfor.append(avatarContainer);

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

async function actionSendMessage(FriendID, Content, Files) {
    let formData = new FormData();
    formData.append("FriendID", FriendID);
    formData.append("Content", Content);
    formData.append("files", Files);
    await $.ajax({
      url: domain+ "/message/send-message",
      type: "POST",
      headers: myHeaders,
      processData: false,
      contentType: false,
      data: formData,
      success: function (result) {
        checkStatus = true;
      },
      error: function (error) {
        checkStatus = false;
      },
    });
}

function getMessages(friend) {
  $.ajax({
    url:
      "http://localhost:8888/api/message/get-message?FriendID=" +
      friend.FriendID,
    method: "GET",
    contentType: "application/json",
    headers: myHeaders,
    success: function (result) {
      arrStorageMessage.length=0;
      result.data.forEach((mess) => {
        arrStorageMessage.push(mess);
      });
      renderMessage(friend, result);
    },
    error: function (error) {
      console.log("error: ", error);
    },
  });
}

function renderAvatar(friend){
  let avatarDiv=$("<div>").addClass("avatar-message-container");
  let avatarUrl = friend.Avatar? domain+"/images" + friend.Avatar: "/images/defaultavatar.jpg";    
  const avatar = $("<img>").addClass("avatar-message").attr("src", avatarUrl);
  avatarDiv.append(avatar)
  return avatarDiv;
}

function renderFile(Files,type)
{
  const file=$("<div>");
  if (type==0)  {file.addClass("friend-file").attr("urlFile", Files.urlFile);} 
  else {
    file.addClass("my-file").attr("urlFile", Files.urlFile);
  }
  const fileImage = $("<img>").addClass("file-image").attr("src", "/images/file-icon.svg");
  const fileName = $("<p>").addClass("file-name").text(Files.FileName);
  file.append(fileImage);
  file.append(fileName);              
  return file;
}

function renderImage(Images){
  const showImage = $("<img>").addClass("show-image").attr("src",domain +Images.urlImage);
  return showImage;                           
}

function renderEmptyMessage()
{
  const listMessage = $("<div>");
  const emptyMessage = $("<img>").addClass("empty-message-img").attr("src", "/images/empty-list-message.png");
  listMessage.append(emptyMessage);
  return listMessage;
}

function renderMessageStatus(data,type)
{
  let formattedTime = moment(data.CreatedAt).format("hh:mm A");
  if (type==0)
  {
    const sendTime = $("<p>").addClass("send-time-friend-message").text(formattedTime);
    return sendTime;
  }else 
  {
    if (formattedTime == "Invalid date") 
    {
      const check = $("<div>").addClass("check");
      const sendTime = $("<p>").addClass("send-time-my-message").text("Đang gửi"); 
      console.log(checkStatus);
      if (!checkStatus) {
        setTimeout(function () {
          sendTime.text("Gửi lỗi");
          sendTime.addClass("active");
        }, 2000);
      }
      check.append(sendTime);
      return check;
    }else {
      const check = $("<div>").addClass("check");
      const checkIcon = $("<img>").addClass("check-icon").attr("src", "/images/Check all.png");
      const sendTime = $("<p>").addClass("send-time-my-message").text(formattedTime);
      check.append(checkIcon);
      check.append(sendTime);
      return check;
    }
  } 
  
}

function renderFunction(){
  const func = $("<div>").addClass("function");
  const btnReaction = $("<button>").addClass("btn-reaction");
  const reactionImg = $("<img>").addClass("reaction-img").attr("src", "/images/reaction.png");       
  btnReaction.append(reactionImg);

  const btnFunction = $("<button>").addClass("btn-function");
  const functionImg = $("<img>").addClass("function-img").attr("src", "/images/Menu.png");
  btnFunction.append(functionImg);

  func.append(btnReaction);
  func.append(btnFunction);
  return func;
}

function renderMessage(friend, arrMess) 
{
  getAllMessage.empty();
  if (arrMess.data.length == 0) {
    getAllMessage.append(renderEmptyMessage);
  } else 
  {
    let flag = -1;
    for (let i = 0; i < arrMess.data.length; i++) {
      if (i <= flag) {
        continue;
      } else {
        const listMessage = $("<div>");
        if (arrMess.data[i].MessageType == 0) {
          listMessage.addClass("list-friend-message");

          const friendMessage = $("<div>").addClass("friend-messages");
          for (let j = i; j < arrMess.data.length; j++) {
            if (arrMess.data[j].Files.length > 0) {
              friendMessage.append(renderFile(arrMess.data[j].Files[0],0));
            }
            if (arrMess.data[j].Images.length > 0) {
              friendMessage.append(renderImage(arrMess.data[j].Images[0]));
            }
            if (arrMess.data[j].Content=='') break;
            const content = $("<p>").addClass("friend-message").text(arrMess.data[j].Content);
            friendMessage.append(content);  
            if (j == arrMess.data.length - 1) break;
            else {
              let startTime = moment(arrMess.data[j].CreatedAt);
              let endTime = moment(arrMess.data[j + 1].CreatedAt);
              if (
                startTime.isSame(endTime, "hour") &&
                startTime.isSame(endTime, "minute") &&
                arrMess.data[j + 1].MessageType == 0
              ) {
                flag = j + 1;
              } else break;
            }
          }
          friendMessage.append(renderMessageStatus(arrMess.data[i],0));

          listMessage.append(renderAvatar(friend));
          listMessage.append(friendMessage);
          listMessage.append(renderFunction());

          getAllMessage.append(listMessage);
        } else {
          listMessage.append(renderFunction);

          const myMessage = $("<div>").addClass("my-messages");

          for (let j = i; j < arrMess.data.length; j++) {
            if (arrMess.data[j].Files.length > 0) {              
              myMessage.append(renderFile(arrMess.data[j].Files[0],1));
            }
            if (arrMess.data[j].Images.length > 0) {             
              myMessage.append(renderImage(arrMess.data[j].Images[0]));
            }
            if (arrMess.data[j].Content=='') break;
            const content = $("<p>").addClass("my-message").text(arrMess.data[j].Content);
            myMessage.append(content);
            if (j == arrMess.data.length - 1) break;
            else {
              let startTime = moment(arrMess.data[j].CreatedAt);
              let endTime = moment(arrMess.data[j + 1].CreatedAt);
              if (
                startTime.isSame(endTime, "hour") &&
                startTime.isSame(endTime, "minute") &&
                arrMess.data[j + 1].MessageType == 1
              ) {
                flag = j + 1;
              } else {
                break;
              }
            }
          }
          listMessage.addClass("list-my-message");
          myMessage.append(renderMessageStatus(arrMess.data[i],1));
          listMessage.append(myMessage);
          getAllMessage.append(listMessage);
        }
      }
    }
  }

  $(".list-message").scrollTop($(".list-message")[0].scrollHeight);
}

function filterFriend() {
  $("#search-input").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#friends .left-container-channel").filter(function () {
      var text = $(this).find(".h4content").text().toLowerCase();
      $(this).toggle(text.indexOf(value) > -1);
    });
  });
}
function downloadFile(urlFile) {
  $.ajax({
    url: domain+ urlFile,
    method: "GET",
    success: function (result) {
      var link = document.createElement("a");
      link.href = domain + urlFile;
      link.target = "_blank";
      link.click();
    },
    error: function (error) {
      console.log("error: ", error);
    },
  });
}
