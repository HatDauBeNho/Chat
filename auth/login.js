$(document).ready(function () {
  const form = $("#login");
  const btnSubmitLogin = $("#btnSubmitLogin");

  btnSubmitLogin.on("click", function (e) {
    e.preventDefault();
    login(
      form.find('[name="username"]').val(),
      form.find('[name="password"]').val()
    );
  });
  $(".clean-input").click(function () {
    $("#username").val('');
  });
  $(".show-password").click(function () {
    var passwordField = $("#password");
    var passwordFieldType = passwordField.attr("type");
    if (passwordFieldType == "password") {
      passwordField.attr("type", "text");
    } else {
      passwordField.attr("type", "password");
    }
  });
});
function login(Username, Password) {
  var raw = JSON.stringify({
    Username: Username,
    Password: Password,
  });

  $.ajax({
    url: "http://10.2.44.52:8888/api/auth/login",
    method: "POST",
    contentType: "application/json",
    data: raw,
    success: function (result) {
      localStorage.setItem("token", result.data.token);
      window.location.href = "/message/listFriend.html";
    },
    error: function (error) {
      console.log("error", error);
      $('#login-fail').text('Sai tài khoản hoặc mật khẩu').show();
    },
  });
}
