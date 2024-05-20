 $(document).ready(function(){
    const form=$("#register");
    const btnSubmitRegister=$("#btnSubmitRegister");

    btnSubmitRegister.on("click",function(e)
    {
      e.preventDefault();
      if (form.find('[name="fullname"]').val()==''&&form.find('[name="username"]').val()==''&&form.find('[name="password"]').val()=='') 
        alert ("Ban chua nhap thong tin");
    else{
        register(
            form.find('[name="fullname"]').val(),
            form.find('[name="username"]').val(),
            form.find('[name="password"]').val()
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
      var passwordField = $("#password");
      var passwordFieldType = passwordField.attr("type");
      if (passwordFieldType == "password") {
        passwordField.attr("type", "text");
      } else {
        passwordField.attr("type", "password");
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