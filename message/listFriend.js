const token = localStorage.getItem("token");
const friendsList = $("#friends");
const getUser = document.getElementById("getUser");
const getAllMessage = document.getElementById("messages");
const messageForm = document.getElementById("messageForm");
const btnLogout = document.getElementById("logout");
const sendMessage = document.querySelector("#sendMessage");
const btnSendMessage = document.querySelector("#btnSendMessage");

var myHeaders = { Authorization: `Bearer ${token}` };
var requestOptions = {
  method: "GET",
  contentType: "application/json",
  headers: myHeaders,
};
$(document).ready(function () {
  getUserInfor();
  getListFriend();
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
        $("#avatar").attr(
          "src",
          "http://10.2.44.52:8888/api/images" + result.data.Avatar
        );
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
    url: "http://10.2.44.52:8888/api/message/list-friend",
    method: "GET",
    contentType: "application/json",
    headers: myHeaders,
    success: function (result) {
      $("div").addClass("leftContainerChannel");
      
    },
  });
  fetch("http://10.2.44.52:8888/api/message/list-friend", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("Result:", result);
      if (result.status == 1) {
        result.data.forEach((friend) => {
          const listItem = document.createElement("div");
          listItem.classList.add("leftContainerChannel");
          listItem.dataset.friend = JSON.stringify(friend);

          const avatar = document.createElement("img");
          avatar.classList.add("avatar");
          avatar.src = "http://10.2.44.52:8888/api/images" + friend.Avatar;
          listItem.appendChild(avatar);

          const friendInfo = document.createElement("div");
          friendInfo.classList.add("leftContainerChannelInfor");

          const fullName = document.createElement("h4");
          fullName.classList.add("h4content");
          fullName.textContent = friend.FullName;
          friendInfo.appendChild(fullName);

          fetch(
            "http://10.2.44.52:8888/api/message/get-message?FriendID=" +
              friend.FriendID,
            requestOptions
          )
            .then((response1) => {
              return response1.json();
            })
            .then((result1) => {
              console.log("result1", result1);
              if (result1.status == 1) {
                const lastMessage = document.createElement("p");
                lastMessage.classList.add("content");
                if (result1.data[result1.data.length - 1].MessageType == 0)
                  lastMessage.textContent =
                    result1.data[result1.data.length - 1].Content;
                else
                  lastMessage.textContent =
                    "You:" + result1.data[result1.data.length - 1].Content;
                friendInfo.appendChild(lastMessage);
              } else {
                console.error("Error: " + result2.message);
              }
            })
            .catch((error2) => console.log("error", error2));
          listItem.appendChild(friendInfo);
          friendsList.appendChild(listItem);
        });
      } else {
        console.error("Error: " + result.message);
      }
    })
    .catch((error) => {
      console.error("Error fetching friends list:", error);
    });
}

//su kien click vao ban be va lay tin nhan
friendsList.addEventListener("click", function (event) {
  if (event.target && event.target.classList.contains("leftContainerChannel")) {
    // Lấy thông tin về friend từ phần tử cha
    const friend = event.target.dataset.friend;
    friendClick(JSON.parse(friend));
    const friendID = JSON.parse(friend).FriendID;
    //lay tin nhan
    fetch(
      "http://10.2.44.52:8888/api/message/get-message?FriendID=" + friendID,
      requestOptions
    )
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        console.log("result", result);
        //Xoa form cu
        const existingMessageForm = messageForm.querySelector(
          ".rightContainerMessageComposer"
        );
        if (existingMessageForm) {
          existingMessageForm.remove();
        }
        const existingFriendMessage = getAllMessage.querySelectorAll(
          ".rightContainerListMessageFriend"
        );
        //Tao form gui tin nhan
        // const divMessageForm = document.createElement("div");
        // divMessageForm.classList.add("rightContainerMessageComposer");

        // const btnPlus = document.createElement("button");
        // btnPlus.classList.add("rightContainerMessageComposerPlus");
        // const plusImage = document.createElement("img");
        // plusImage.classList.add("rightContainerMessageComposerPlusIcon");
        // plusImage.src = "attach.png";
        // btnPlus.appendChild(plusImage);
        // divMessageForm.appendChild(btnPlus);

        // const divEnterInput = document.createElement("div");
        // divEnterInput.classList.add("rightContainerMessageComposerEnter");
        // const inputMessage = document.createElement("input");
        // inputMessage.classList.add("rightContainerMessageComposerEnterInput");
        // inputMessage.placeholder = "Nhập tin nhắn";
        // inputMessage.id = "message";
        // const btnEmo = document.createElement("btn");
        // btnEmo.classList.add("rightContainerMessageComposerEnterEmo");
        // const emoImage = document.createElement("img");
        // emoImage.classList.add("rightContainerMessageComposerEnterEmoIcon");
        // emoImage.src = "smile.png";
        // btnEmo.appendChild(emoImage);
        // divEnterInput.appendChild(inputMessage);
        // divEnterInput.appendChild(btnEmo);
        // divMessageForm.appendChild(divEnterInput);

        // const btnSendMessage = document.createElement("button");
        // btnSendMessage.classList.add("rightContainerMessageComposerSend");
        // const sendImage = document.createElement("img");
        // sendImage.classList.add("rightContainerMessageComposerSendIcon");
        // sendImage.src = "Send Button.png";
        // btnSendMessage.appendChild(sendImage);
        // divMessageForm.appendChild(btnSendMessage);
        // messageForm.appendChild(divMessageForm);

        //Xuat toan bo tin nhan
        if (result.status == 1) {
          result.data.forEach((message) => {
            const listMessage = document.createElement("div");
            if (message.MessageType == 0) {
              listMessage.classList.add("rightContainerListMessageFriend");

              const avatar = document.createElement("img");
              avatar.classList.add("avatarMessage");
              avatar.src =
                "http://10.2.44.52:8888/api/images" + JSON.parse(friend).Avatar;
              listMessage.appendChild(avatar);

              const content = document.createElement("p");
              content.classList.add("friendMessage");
              content.textContent = message.Content;

              listMessage.appendChild(content);
              getAllMessage.appendChild(listMessage);
            } else {
              listMessage.classList.add("rightContainerListMyMessage");
              const content = document.createElement("p");
              content.classList.add("myMessage");
              content.textContent = message.Content;

              listMessage.appendChild(content);
              getAllMessage.appendChild(listMessage);
            }
          });
        } else {
          console.error("Error: " + result.message);
        }
      })
      .catch((error) => console.log("error", error));
    // console.log(sendMessage.querySelector('[name="message"]').value);
    // const btnSendmessage = document.querySelector("#btnSendMessage");
    // btnSendmessage.addEventListener("click", function (e) {
    //   e.preventDefault();
    //   actionSendMessage(
    //     friendID,
    //     sendMessage.querySelector('[name="message"]').value
    //   );
    // });
  }
  //set background cho ban be duoc chon
  $(".leftContainerChannel").click(function () {
    $(".leftContainerChannel").removeClass("active");
    $(this).addClass("active");
  });

  //gui tin nhan
});

// lay user
// function friendClick(friend) {
//   const existingUser = getUser.querySelector(".rightContainerHeader");
//   if (existingUser) {
//     existingUser.remove();
//   }
//   const existingFriendMessage = getAllMessage.querySelectorAll(
//     ".rightContainerListMessageFriend"
//   );
//   existingFriendMessage.forEach((message) => {
//     message.remove();
//   });
//   const existingMyMessage = getAllMessage.querySelectorAll(
//     ".rightContainerListMyMessage"
//   );
//   existingMyMessage.forEach((message) => {
//     message.remove();
//   });
//   const userInfor = document.createElement("div");
//   userInfor.classList.add("rightContainerHeader");

//   const avatar = document.createElement("img");
//   avatar.classList.add("rightContainerHeaderAvatar");
//   avatar.src = "http://10.2.44.52:8888/api/images" + friend.Avatar;
//   userInfor.appendChild(avatar);

//   const detailDiv = document.createElement("div");
//   detailDiv.classList.add("rightContainerHeaderInfor");

//   const fullName = document.createElement("h3");
//   fullName.classList.add("rightContainerHeaderUserName");
//   fullName.textContent = friend.FullName;
//   detailDiv.appendChild(fullName);

//   const status = document.createElement("p");
//   status.textContent = friend.isOnline ? "Online" : "Offline";
//   status.classList.add("rightContainerHeaderStatus");
//   detailDiv.appendChild(status);

//   userInfor.appendChild(detailDiv);
//   getUser.appendChild(userInfor);
// }
function friendClick(friend) {
  // Chọn phần tử rightContainerHeader
  const $userInfor = $(".rightContainerHeader");

  // Nếu phần tử này đã tồn tại, thay đổi nội dung của nó
  if ($userInfor.length > 0) {
    // Thay đổi nội dung ảnh đại diện
    $userInfor
      .find(".rightContainerHeaderAvatar")
      .attr("src", "http://10.2.44.52:8888/api/images" + friend.Avatar);

    // Thay đổi nội dung tên và trạng thái
    $userInfor.find(".rightContainerHeaderUserName").text(friend.FullName);
    $userInfor
      .find(".rightContainerHeaderStatus")
      .text(friend.isOnline ? "Online" : "Offline");
  } else {
    // Nếu phần tử không tồn tại, tạo mới và thêm vào
    const $userInfor = $("<div>").addClass("rightContainerHeader");

    const $avatar = $("<img>")
      .addClass("rightContainerHeaderAvatar")
      .attr("src", "http://10.2.44.52:8888/api/images" + friend.Avatar);
    $userInfor.append($avatar);

    const $detailDiv = $("<div>").addClass("rightContainerHeaderInfor");

    const $fullName = $("<h3>")
      .addClass("rightContainerHeaderUserName")
      .text(friend.FullName);
    $detailDiv.append($fullName);

    const $status = $("<p>")
      .text(friend.isOnline ? "Online" : "Offline")
      .addClass("rightContainerHeaderStatus");
    $detailDiv.append($status);

    $userInfor.append($detailDiv);
    $(".getUser").append($userInfor);
  }
}

//gui tin nhan

function actionSendMessage(FriendID, Content) {
  var formData = new FormData();
  formData.append("FriendID", FriendID);
  formData.append("Content", Content);
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  var requestOptions1 = {
    method: "POST",
    headers: myHeaders,
    body: formData,
  };
  fetch("http://10.2.44.52:8888/api/message/send-message", requestOptions1)
    .then((response) => response.json())
    .then((result) => {
      console.log("result", result);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
