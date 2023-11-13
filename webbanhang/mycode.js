$(document).ready(function () {
    const api = '/api.aspx';

    
        const btn = document.querySelectorAll("button")
        console.log(btn)
       
    $('.muahang').click(function () {
        alert('jdjcndncjdncj')
        form_dang_nhap();
    });
    function form_dang_nhap() {
        var content =
            `     
         <div class="form-group">
            <label for="create-name">Name :</label><br>
            <input type="text" id="login-name" placeholder="Your name" required>
        </div>
        <div class="form-group">
            <label for="create-pw">Mật khẩu :</label><br>
            <input type="text" id="login-pw" placeholder="Your password" required>
        </div>                 
         `
        $.
            title: 'Đăng Nhập!',
            content: content,
            buttons: {
                formSubmit: {
                    text: 'Đăng Nhập',
                    btnClass: 'btn-primary',

                    action: function () {
                        var data_gui_di = {
                            action: 'US_login',
                            User_Name: $('#login-name').val(),
                            pw: $('#login-pw').val()
                        }
                        

                        $.post(api, data_gui_di, function (data) {
                            var json = JSON.parse(data);
                            if (json.ok == 1) {
                                
                                dialog_dangnhap.close();                              

                            } else {
                                alert(json.msg)
                            }
                        })
                    }
                },
                cancel: {},
            },
        });
    };

//btn.forEach(function (button, index) {
//    console.log(button, index)

    //button.addEventListener("click", function (event) {
    //    {

    //        var btnItem = event.target
    //        var product = btnItem.parentElement
    //        console.log(product)
//            var productImg = product.querySelector("img").src
//            /*console.log(cartImg*/
//    var productName = product.querySelector("h1").innerText
//    var productPrice = product.querySelector("product-price").innerText
//    addcart(productPrice, productName, productImg)
//}})
//})



//function addcart(productPrice, productName, productImg) {
//    var addtr = document.createElement("tr")
//    var trcontent = productPrice
//    var cartTable = document.querySelector("tbody")
//    /*console.log(cartTable)*/
//    cartTable.append(addtr)

//}
})
