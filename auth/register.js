 $(document).ready(function(){
    const form=$("#register");
    const btnSubmitRegister=$("#btnSubmitRegister");

    btnSubmitRegister.on("click",function(e)
    {
      e.preventDefault();
      let fullname=form.find('[name="fullname"]').val();
      let username=form.find('[name="username"]').val();
      let password=form.find('[name="password"]').val();
      let confirmPassword=form.find('[name="confirm-password"]').val();
      if (fullname==''&&username==''&&password==''&&confirmPassword==''&&password==confirmPassword) 
        alert ("Ban chua nhap thong tin");
    else{
        register(
          fullname,
          username,
          password,
          );
    }
      
    });
    $(".clean-input").click(function () {
      $("#username").val('');
    });
    $(".clean-input").click(function () {
      $("#fullname").val('');
    });
    $(".show-password").click(function () {
      let passwordField = $("#password");
      let passwordFieldType = passwordField.attr("type");
      if (passwordFieldType == "password") {
        passwordField.attr("type", "text");
      } else {
        passwordField.attr("type", "password");
      }
    });
    $(".show-confirm-password").click(function () {
      console.log("adu");
      let confirmPasswordField = $("#confirm-password");
      let confirmPasswordFieldType = confirmPasswordField.attr("type");
      if (confirmPasswordFieldType == "password") {
        confirmPasswordField.attr("type", "text");
      } else {
        confirmPasswordField.attr("type", "password");
      }
    });
  });
  function register(FullName,Username,Password)
  {
    var raw = JSON.stringify({
      FullName: FullName,
      Username: Username,
      Password: Password,
    });
    $.ajax({
      url: "http://10.2.44.52:8888/api/auth/register",
      method: "POST",
      contentType: "application/json",
      data:raw,
      success: function(result)
      {
        console.log(result);
        alert("Đăng ký thành công");
        window.location.href="/login.html";
      },
      error: function(error)
      {
        console.log("error: ",error);
        alert("Đã xảy ra lỗi trong quá trình đăng ký");
      }
    })
  }