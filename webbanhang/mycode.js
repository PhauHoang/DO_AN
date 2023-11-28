$(document).ready(function () {
    const api = '/apiCuaHang.aspx';
    //code js here mẫu của jquery

    function delete_company(MAKH, json) {
        var cty;
        for (var item of json.data) {
            if (item.MAKH == MAKH) {
                cty = item;
                break;
            }
        }
        //xác nhận trước khi xóa
        var dialog_xoa = $.confirm({
            title: `Xác nhận xóa Khách Hàng? ${cty.MAKH}`,
            content: `Xác nhận xóa nhé????`,
            buttons: {
                YES: {
                    action: function () {
                        var data_gui_di = {
                            action: 'delete',
                            MAKH: MAKH, //gửi đi id của cty cần xóa: api, sp sẽ làm phần còn lại
                        }
                        $.post(api, data_gui_di, function (data) {
                            //đợi data là json string text gửi về
                            var json = JSON.parse(data); //json string text => obj
                            if (json.ok) { //dùng obj
                                dialog_xoa.close();
                                cap_nhap_company();  //vẽ lại kq mới
                            } else {
                                alert(json.msg) // lỗi gì ở trên lo, ta cứ show ra thôi
                            }
                        })
                    }
                },
                NO: {

                }
            }
        })
    }
    function edit_company(MAKH, json) {
        //show 1 dialog: điền sẵn các thông của công ty cần edit
        //chờ bấm save -> gọi api: truyền đi các value đã bị edit -> nhận về json kết quả

        //json và id => cty
        var cty;
        for (var item of json.data) {
            if (item.MAKH == MAKH) {
                cty = item;
                break;
            }
        }
        var content = `SỬA THÔNG TIN KHÁCH HÀNG:<BR>
    Mã KH: <input type=text id="edit-id" value="${cty.MAKH}"> 
    Tên KH: <input type=text id="edit-name" value="${cty.TENKH}"> <br>
    Địa Chỉ: <input type=text id="edit-address" value="${cty.DIACHI}"> 
    PHONE: <input type=text id="edit-phone" value="${cty.SĐT}">
    `
        var dialog_edit = $.confirm({
            title: 'BẢNG THÔNG TIN KHÁCH HÀNG',
            content: content,
            columnClass: 'large',
            buttons: {
                save: {
                    action: function () {
                        var data_gui_di = {
                            action: 'edit',
                            name: $('#edit-name').val(),
                            address: $('#edit-address').val(),
                            makh: MAKH,
                            phone: $('#edit-phone').val(),

                        }
                        //console.log(data_gui_di);
                        $.post(api, data_gui_di, function (data) {
                            var json = JSON.parse(data);
                            if (json.ok) {
                                dialog_edit.close();
                                cap_nhap_company();
                            } else {
                                alert(json.msg)
                            }
                        })
                    }
                },
                cancel: {

                }
            }
        })
    }
    function cap_nhap_company() {
        $.post(api,
            {
                action: 'list'
            },
            function (data) {
                //alert(data)
                var json = JSON.parse(data); //txt trong data -> obj json
                var noidung_ds_cty_html = "";
                if (json.ok) {
                    noidung_ds_cty_html += `<table class="table table-hover">
              <thead>
              <tr>
                <th>STT</th>
                    <th>Mã KH</th>
                    <th>Tên</th>
                    <th>Đ/C</th>
                    <th>Phone</th>
                    <th>Sửa/xóa</th>
              </tr>
              </thead><tbody>`;
                    //duyet json -> noidung_ds_cty_html xịn
                    var stt = 0;
                    for (var cty of json.data) {
                        //sua_xoa là 2 nút: mỗi nút kèm theo data để sau này phân loại: là data-cid  và data-action
                        var sua_xoa = `<button class="btn btn-sm btn-warning nut-sua-xoa" data-cid="${cty.MAKH}" data-action="edit">Sửa</button>`;
                        sua_xoa += ` <button class="btn btn-sm btn-danger nut-sua-xoa" data-cid="${cty.MAKH}" data-action="delete">Xóa</button>`;
                        noidung_ds_cty_html += `
                <tr>
                <td>${++stt}</td>
                <td>${cty.MAKH}</td>
                <td>${cty.TENKH}</td>
                <td>${cty.DIACHI}</td>
                <td>${cty.SDT}</td>
                <td>${sua_xoa}</td>
              </tr>`;
                    }

                    noidung_ds_cty_html += "</tbody></table>";
                } else {

                    noidung_ds_cty_html = "không có dữ liệu";
                }
                //đưa html vừa nối nối vào chỗ định trước: #ds_cong_ty
                $('#ds_cong_ty').html(noidung_ds_cty_html); //gán html vào thân dialog

                //trong html vừa đua vào có nhiều nút sửa và xóa, đều có class nut-sua-xoa
                //selector này tóm đc mọi nút
                $('.nut-sua-xoa').click(function () {
                    //phân biệt các nút bằng data kèm theo
                    var action = $(this).data('action')  //lấy action kèm theo
                    var MAKH = $(this).data('cid')  //lấy cid kèm theo
                    if (action == 'delete') { //dùng action
                        //can xac nhan
                        delete_company(MAKH, json); //dùng id vào đây để hàm này xử, cho khỏi rối code
                    } else if (action == 'edit') {
                        //ko can xac nhan
                        edit_company(MAKH, json);
                    }
                });
            })
    }
    function add_company() {
        //show 1 dialog, các truongf để trông để user nhập
        //sau đó thu nhận các value đã input, có thể check đk trước khi gửi
        //gửi api, thu về json, ok=1 =>cap_nhap_company
        var content = `Thông tin khách hàng mới:..<hr>
        
        <label>Tên KH:</label> <input style = "margin-left:2px" id="nhap-name"><br>
        Địa Chỉ: <input id="nhap-address"><br>
           SĐT:<input style = "margin-left:27px" id="nhap-sdt">


    `
        var dialog_add = $.confirm({

            title: 'Thêm mới 1 KH',
            content: content,
            buttons: {
                save: {
                    text: 'Thêm khách hàng',
                    action: function () {
                        //sau đó thu nhận các value đã input, có thể check đk trước khi gửi
                        //gửi api, thu về json, ok=1 =>cap_nhap_company
                        var data_gui_di = {

                            action: 'add',
                            // MAKH: $('#Nhap-id').val(),
                            TENKH: $('#nhap-name').val(),
                            DIACHI: $('#nhap-address').val(),
                            SĐT: $('#nhap-sdt').val()


                        }
                        //console.log(data_gui_di);
                        $.post(api, data_gui_di, function (data) {
                            var json = JSON.parse(data);
                            if (json.ok) {
                                dialog_add.close();
                                cap_nhap_company();
                            } else {
                                alert(json.msg)
                            }
                        });
                    }//het save
                },
                xxx: {}
            }//button
        });
    }
    function list_company() {
        var dialog_list_company = $.confirm({
            title: "DANH SÁCH KHÁCH HÀNG",
            content: `<div id="ds_cong_ty">Loading...</div>`,
            columnClass: 'large',
            buttons: {
                add: {
                    text: 'THÊM KHÁCH HÀNG',
                    action: function () {
                        add_company();
                        return false; // ko đóng dialog_list_company
                    }
                },
                close: {

                }
            },
            onContentReady: function () {
                //alert('dialog show ok')
                //hoi api: ds cong ty la json nao?
                cap_nhap_company(); //fill html vào thêm dialog tại div#ds_cong_ty
            }
        });
    }

    $('#btn_logout').click(function () {
        $('.nut-xin-chao').addClass("not-show");
        $('#btn_logout').addClass("not-show");
        $('#btn_dangky').removeClass("not-show");
        $('#btn_dangnhap').removeClass("not-show");
       
    });
    $('#btn_khachhang').click(function () {
        list_company();
    });


    $('#btn_dangnhap').click(function () {
        form_dang_nhap();
    })
    function form_dang_nhap() {
        var content =
            `     
          <style>
               input {
                  border: 1px solid #ccc;
                  border-radius: 5px;
                       }  
                .form-group{
                    margin:auto inherit;
                }
          </style>
          <div class="form-group">
             <label for="create-name">ID :</label><br>
             <input type="text"  id="login-name" placeholder="Your name" required>
         </div>
         <div class="form-group">
             <label for="create-pw">Mật khẩu :</label><br>
             <input type="password" id="login-pw" placeholder="Your password" required>   
           
         </div>                 
          `

        $.confirm({
            title: 'Đăng Nhập!',
            content: content,
            buttons: {
                formSubmit: {
                    text: 'Đăng Nhập',
                    btnClass: 'btn-primary',
                    keys: ['enter', 'Enter'],
                    action: function () {
                        var data_gui_di = {
                            action: 'login',
                            id: $('#login-name').val(),
                            pw: $('#login-pw').val()
                        }
                        $.post(api, data_gui_di, function (data) {
                            var json = JSON.parse(data)
                            if (json.ok == 1) {
                                $('.nut-xin-chao').removeClass("not-show")
                                $('#btn_logout').removeClass("not-show")
                                $('#btn_dangky').addClass("not-show")
                                $('#btn_dangnhap').addClass("not-show")
                                // NẾU QUYỀN BẰNG 1 THÌ LÀ ADMIN
                                // NGƯỢC LẠI LÀ KHÁCH HÀNG
                                if (json.QUYEN == 1) {
                                    $('.nut-xin-chao').html(`XIN CHÀO ADMIN`)
                                    $('#btn_khachhang').removeClass("not-show")
                                } else {
                                    $('#btn_khachhang').addClass("not-show")
                                    $('.nut-xin-chao').html(`XIN CHÀO BẠN`)

                                }

                            } else {
                                alert([json.msg]);
                            }

                        })
                    }
                },
                cancel: {},

            },
        });
    };


    //đăng ký



    trang_chu();
    function trang_chu() {
        var noidung = "";
        var data_gui_di = {
            action: 'MATHANG_LIST'
        }
        $.post(api, data_gui_di,
            function (data) {
                var json = JSON.parse(data);
                if (json.ok) {
                    var stt = 0;
                    for (var hanghoa of json.data) {

                        var muahang = `<button class="btn btn-sm btn-primary nut-mua-ngay" data-cid="${hanghoa.MAHH}""><ion-icon name="cart-outline"></ion-icon> Mua Ngay</button>`;
                        noidung +=
                            `
<div class="book-container" style="width: 22%; height :380px;  margin: 15px; text-align: center; border: 1px solid #ccc; padding: 10px; display: inline-block; box-sizing: border-box;transition: box-shadow 0.3s;" onmouseover="this.style.boxShadow='0 0 10px rgba(0, 0, 0, 0.5)'" onmouseout="this.style.boxShadow='none';">
        <img src="${hanghoa.ANH}" alt="Ảnh bìa sách" style="width: 150px; height:  200px; margin-bottom: 10px;">
        <h2 style="font-size: 18px; margin-bottom: 5px;">${hanghoa.TEN}</h2>
        <p class="book-price" style="font-weight: bold; color: #FF5733;">${hanghoa.GIA} VNĐ </p>
 <p>${muahang}</p>
</div> 
`
                    }
                } else {
                    noidung = "Không có dữ liệu nhé !!";
                }
                $('.products-item').html(noidung);
                $('.nut-mua-ngay').click(function () {
                    var mahang = $(this).data('cid');
                    form_muahang(mahang, data)
                })
                $('.buy-now').click(function () {
                    var mahang = $(this).data('cid');
                    console.log(mahang);
                })
            })
    }

    function getdate() {
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0, cần cộng thêm 1
        var year = currentDate.getFullYear();

        return ('' + day + '/' + month + '/' + year);
    }
    function form_muahang(mahang, data) {
        var hh;
        var json = JSON.parse(data);
        for (var item of json.data) {
            if (item.MAHH == mahang) {
                hh = item;
                break;
            }
        }

        var mahoadon = Math.random();
        var content =
            ` <pre>
                    CHÀO MỪNG QUÝ KHÁCH MUA HÀNG 
                    Mã Hóa đơn : ${mahoadon}
                    Ngày       : ${getdate()}
                      

                    Tên sản phẩm  : ${hh.TEN}  
                    <img style="width: 170px; " src="${hh.ANH}" />
                    Giá Tiền      : ${hh.GIA} VNĐ
                    Số lượng      : <input type="int" id="soluong" placeholder="Số lượng " required>
                    Mã Kh         : <input type="int" id="MAKH" placeholder="Mã KH " required>
                   Tên người nhận : <input type="int" id="TENKH" placeholder="Tên người nhận " required>
                    Đia chỉ       : <input type="int" id="DIACHI" placeholder="Địa chỉ " required>
                    Số điện thoại : <input type="int" id="GIATIEN" placeholder="Số điện thoại " required>
                    
            </pre>`


        $.confirm({
            title: '<b> Xác Nhận Đơn Hàng </b>',
            content: content,
            columnClass: 'medium',

            buttons: {
                formSubmit: {
                    text: 'Đặt hàng',
                    btnClass: 'btn-primary',
                    action: function () {
                        if ($('#soluong').val() != null) {
                            var data_bang_hoa_don = {
                                action: 'BH_THEM_DONDATHANG',
                                SOHOADON: mahoadon,
                                MAKH: $('#MAKH').val()

                            }


                            var data_bang_chi_tiet = {
                                action: 'BH_THEM_CHITIETDATHANG',
                                SOHOADON: mahoadon,
                                MAHH: mahang,
                                soluong: $('#soluong').val(),
                                giaban: hh.GIA,

                            }
                            var data_khachhang = {
                                action: 'BH_THEM_KHACHHANG',
                                MAKH: $('#MAKH').val(), 
                                TENKH: $('#TENKH').val(),
                                DIACHI: $('#DIACHI').val(),
                                
                            }
                            $.post(api, data_khachhang, function (data) { });

                    
                            
                           
                            $.post(api, data_bang_hoa_don, function (data) { });
                            
                            $.post(api, data_bang_chi_tiet, function (data) { });

                        } else {

                            return;
                        }


                    }
                },
                cancel: {},
            },
        });

    };

    //Đăng ký
    $('#btn_dangky').click(function () {
        form_dang_ky();
    });
    function form_dang_ky() {
        var content =
            `     
             <style>
                  input {
                     border: 1px solid #ccc;
                     border-radius: 5px;
                          }       
             </style>
             
    <pre>
    USER NAME  : <input type="text" id="tao-name" placeholder="nhập user name" required>    
    HỌ ĐỆM     : <input type="text" id="tao-hodem" placeholder="nhập họ đệm" required>
    TÊN        : <input type="text" id="tao-ten" placeholder="nhập tên " required>
    PW         : <input type="text" id="tao-pw" placeholder=" nhập mật khẩu " required>
    XÁC NHẬN PW: <input type="text" id="tao-pw2" placeholder=" xác nhận mật khẩu " required>
    ĐỊA CHỈ    : <input type="text" id="tao-diachi" placeholder=" nhập địa chỉ " required>
    SDT        : <input type="text" id="tao-sdt" placeholder=" nhập số điện thoại " required>
    </pre>
             `

        var dialog_dangky = $.confirm({
            title: 'Đăng ký tài khoản!',
            content: content,
            columnClass: 'medium',
            buttons: {
                formSubmit: {
                    text: 'Đăng ký',
                    btnClass: 'btn-primary',

                    action: function () {
                        var data_gui_di = {
                            action: 'add-user',
                            User_Name: $('#tao-name').val(),
                            hodem: $('#tao-hodem').val(),
                            ten: $('#tao-ten').val(),
                            pw: $('#tao-pw').val(),
                            pw2: $('#tao-pw').val(),
                            diachi: $('#tao-diachi').val(),
                            SDT: $('#tao-sdt').val()
                        }

                      
                        $.post(api, data_gui_di, function (data) {
                            var json = JSON.parse(data);
                            if (json.ok) {
                                dialog_dangky.close();
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

    $('#nutGioHang').click(function () {
        list_hoa_don_dat_hang();
    });

    function list_hoa_don_dat_hang() {
       
        $.post(api,
            {
                action: 'BH_DANH_SACH_DON_DAT_HANG'
            },
            function (data) {
                var json = JSON.parse(data);
                var noidung = "";
                if (json.ok) {
                    noidung += `<table class="table table-hover " 
                                style="width: 90%; margin:auto"> `;
                    noidung +=
                        `
            <thead>
                <tr>
                  <th>STT</th>
                  <th>TÊN KHÁCH HÀNG</th>
                  <th>Số hóa đơn</th>
                  <th>Tên Mặt hàng</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Ngày mua</th>
                </tr>
            </thead> <tbody>`

                    var stt = 0;
                    for (var hoadon of json.data) {
                        noidung +=
                            `.
            <tr>
                <td>${++stt}</td>
                <td>${hoadon.TEN_KH}</td>
                <td>${hoadon.SO_HD}</td>
                <td>${hoadon.TEN_HH}</td>
                <td>${hoadon.SL}</td>
                 <td>${hoadon.DONGIA}</td>
                  <td>${hoadon.NGAY_DAT}</td>
             
            </tr>
           
            `
                    }
                    noidung += " </tbody> </table>";
                } else {
                    noidung = "Không có dữ liệu nhé !!";
                }

                $.confirm({
                    title: 'Đăng ký tài khoản!',
                    content: noidung,
                    columnClass: 'xlarge',
                    buttons: {
                        formSubmit: {
                            text: 'Đăng ký',
                            btnClass: 'btn-primary',

                            action: function () {



                            }
                        },
                        cancel: {},
                    },
                });

            });

       

    }

    //MẶT HÀNG------------------------------------------------------------------------------------------------------------->


    



    //    //code js here mẫu của jquery

    //    function delete_company(MAHH, json) {
    //        var cty;
    //        for (var item of json.data) {
    //            if (item.MAHH == MAHH) {
    //                cty = item;
    //                break;
    //            }
    //        }
    //        //xác nhận trước khi xóa
    //        var dialog_xoa = $.confirm({
    //            title: `Xác nhận xóa Mặt hàng này ${cty.MAHH}`,
    //            content: `Xác nhận xóa nhé????`,
    //            buttons: {
    //                YES: {
    //                    action: function () {
    //                        var data_gui_di = {
    //                            action: 'delete',
    //                            MAHH: MAHH, //gửi đi id của cty cần xóa: api, sp sẽ làm phần còn lại
    //                        }
    //                        $.post(api, data_gui_di, function (data) {
    //                            //đợi data là json string text gửi về
    //                            var json = JSON.parse(data); //json string text => obj
    //                            if (json.ok) { //dùng obj
    //                                dialog_xoa.close();
    //                                cap_nhap_company();  //vẽ lại kq mới
    //                            } else {
    //                                alert(json.msg) // lỗi gì ở trên lo, ta cứ show ra thôi
    //                            }
    //                        })
    //                    }
    //                },
    //                NO: {

    //                }
    //            }
    //        })
    //    }
    //    function edit_company(MAHH, json) {
    //        //show 1 dialog: điền sẵn các thông của công ty cần edit
    //        //chờ bấm save -> gọi api: truyền đi các value đã bị edit -> nhận về json kết quả

    //        //json và id => cty
    //        var cty;
    //        for (var item of json.data) {
    //            if (item.MAHH == MAHH) {
    //                cty = item;
    //                break;
    //            }
    //        }
    //        var content = `SỬA THÔNG TIN MẶT HÀNG<BR>
    //    Mã HH: <input type=text id="edit-id" value="${cty.MAHH}">
    //    Tên HH: <input type=text id="edit-name" value="${cty.TENHH}"> <br>
    //    Mã NCC: <input type=text id="edit-ncc" value="${cty.MANCC}">
    //    Mã Hàng: <input type=text id="edit-mahang" value="${cty.MALOAIHANG}">
    //    Số lượng: <input type=text id="edit-soluong" value="${cty.SOLUONG}">

    //    `
    //        var dialog_edit = $.confirm({
    //            title: 'edit',
    //            content: content,
    //            columnClass: 'large',
    //            buttons: {
    //                save: {
    //                    action: function () {
    //                        var data_gui_di = {
    //                            action: 'edit',
    //                            name: $('#edit-name').val(),
    //                            address: $('#edit-address').val(),
    //                            id: id,
    //                            lat: 0,
    //                            lng: 1,
    //                            phone: '113',
    //                            zalo: 'zzz'
    //                        }
    //                        //console.log(data_gui_di);
    //                        $.post(api, data_gui_di, function (data) {
    //                            var json = JSON.parse(data);
    //                            if (json.ok) {
    //                                dialog_edit.close();
    //                                cap_nhap_company();
    //                            } else {
    //                                alert(json.msg)
    //                            }
    //                        })
    //                    }
    //                },
    //                cancel: {

    //                }
    //            }
    //        })
    //    }

    //    function cap_nhap_company() {
    //        $.post(api,
    //            {
    //                action: 'list'
    //            },
    //            function (data) {
    //                //alert(data)
    //                var json = JSON.parse(data); //txt trong data -> obj json
    //                var noidung_ds_cty_html = "";
    //                if (json.ok) {
    //                    noidung_ds_cty_html += `<table class="table table-hover">
    //              <thead>
    //              <tr>
    //                <th>STT</th>
    //                    <th>Mã HH</th>
    //                    <th>Tên HH</th>
    //                    <th>MÃ NCC</th>
    //                    <th>Mã Hàng</th>
    //                    <th>Số Lượng</th>
    //                    <th>Sửa/xóa</th>
    //                    </tr>
    //              </thead><tbody>`;
    //                    //duyet json -> noidung_ds_cty_html xịn
    //                    var stt = 0;
    //                    for (var cty of json.data) {
    //                        //sua_xoa là 2 nút: mỗi nút kèm theo data để sau này phân loại: là data-cid  và data-action
    //                        var sua_xoa = `<button class="btn btn-sm btn-warning nut-sua-xoa" data-cid="${cty.MAHH}" data-action="edit">Sửa</button>`;
    //                        sua_xoa += ` <button class="btn btn-sm btn-danger nut-sua-xoa" data-cid="${cty.MAHH}" data-action="delete">Xóa</button>`;
    //                        noidung_ds_cty_html += `
    //                <tr>
    //                <td>${++stt}</td>
    //                <td>${cty.MAHH}</td>
    //                <td>${cty.TENHH}</td>
    //                <td>${cty.MANCC}</td>
    //                <td>${cty.MALOAIHANG}</td>
    //                <td>${cty.SOLUONG}</td>
    //                <td>${sua_xoa}</td>
    //              </tr>`;
    //                    }

    //                    noidung_ds_cty_html += "</tbody></table>";
    //                } else {

    //                    noidung_ds_cty_html = "không có dữ liệu";
    //                }
    //                //đưa html vừa nối nối vào chỗ định trước: #ds_cong_ty
    //                $('#ds_cong_ty').html(noidung_ds_cty_html); //gán html vào thân dialog

    //                //trong html vừa đua vào có nhiều nút sửa và xóa, đều có class nut-sua-xoa
    //                //selector này tóm đc mọi nút
    //                $('.nut-sua-xoa').click(function () {
    //                    //phân biệt các nút bằng data kèm theo
    //                    var action = $(this).data('action')  //lấy action kèm theo
    //                    var MAHH = $(this).data('cid')  //lấy cid kèm theo
    //                    if (action == 'delete') { //dùng action
    //                        //can xac nhan
    //                        delete_company(MAHH, json); //dùng id vào đây để hàm này xử, cho khỏi rối code
    //                    } else if (action == 'edit') {
    //                        //ko can xac nhan
    //                        edit_company(MAHH, json);
    //                    }
    //                });
    //            })
    //    }

    //    function add_company() {
    //        //show 1 dialog, các truongf để trông để user nhập
    //        //sau đó thu nhận các value đã input, có thể check đk trước khi gửi
    //        //gửi api, thu về json, ok=1 =>cap_nhap_company
    //        var content = `Thông tin mặt hàng mới:..<hr>

    //        <label>Mã HH:</label> <input style = "margin-left:2px" id="nhap-mahh"><br>
    //        Tên HH:</label> <input style = "margin-left:2px" id="nhap-name"><br>
    //        Mã NCC: <input id="nhap-ncc"><br>
    //           Mã Hàng:<input style = "margin-left:27px" id="nhap-mahang">
    //           Số Lượng: <input id="nhap-soluong"><br>
    //   `
    //        var dialog_add = $.confirm({

    //            title: 'Thêm mới 1 mặt hàng',
    //            content: content,
    //            buttons: {
    //                save: {
    //                    text: 'Thêm mặt hàng này?',
    //                    action: function () {
    //                        //sau đó thu nhận các value đã input, có thể check đk trước khi gửi
    //                        //gửi api, thu về json, ok=1 =>cap_nhap_company
    //                        var data_gui_di = {

    //                            action: 'add',
    //                            MAHH: $('#Nhap-id').val(),
    //                            TENHH: $('#nhap-name').val(),
    //                            MANCC: $('#nhap-ncc').val(),
    //                            MALOAIHANG: $('#nhap-loaihang').val(),
    //                            SOLUONG: $('#nhap-soluong').val()


    //                        }
    //                        //console.log(data_gui_di);
    //                        $.post(api, data_gui_di, function (data) {
    //                            var json = JSON.parse(data);
    //                            if (json.ok) {
    //                                dialog_add.close();
    //                                cap_nhap_company();
    //                            } else {
    //                                alert(json.msg)
    //                            }
    //                        });
    //                    }//het save
    //                },
    //                xxx: {}
    //            }//button
    //        });
    //    }
    //    function list_company() {
    //        var dialog_list_company = $.confirm({
    //            title: "DANH SÁCH HÀNG HOÁ",
    //            content: `<div id="ds_cong_ty">Loading...</div>`,
    //            columnClass: 'large',
    //            buttons: {
    //                add: {
    //                    text: 'THÊM HÀNG HOÁ',
    //                    action: function () {
    //                        add_company();
    //                        return false; // ko đóng dialog_list_company
    //                    }
    //                },
    //                close: {

    //                }
    //            },
    //            onContentReady: function () {
    //                //alert('dialog show ok')
    //                //hoi api: ds cong ty la json nao?
    //                cap_nhap_company(); //fill html vào thêm dialog tại div#ds_cong_ty
    //            }
    //        });
    //    }
    //    $('#nutGioHang').click(function () {
    //        list_company();
    //    });



    //thêm vào giỏ hàng
    //Index page
})