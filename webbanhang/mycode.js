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
                <td>${cty.SĐT}</td>
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
                                alert('dndjjd')

                            } else {
                                if (!logined) {
                                    $('#message11').html('Sai thông  tin đăng nhập')
                                    return false;
                                };
                            }

                        })
                    }
                },
                cancel: {},

            },
        });
    };


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
                    for (var hanghoa of json.data) {

                        var muahang = `<button class="btn btn-sm btn-primary nut-mua-ngay" data-cid ="${hanghoa.MAHH}"><ion-icon name="cart-outline"></ion-icon> Mua Ngay</button>`;
                        noidung +=
                         
                             `                    
                     <div class="product-top">
                        <a href="" class="product-thumb">
                            <img src="${hanghoa.ANH}" alt="">
                        </a>
                        <a href="" class="buy-now " data-cid ="${hanghoa.MAHH}">Mua Ngay</a>                    
                    </div>
                    <div class="product-infor">
                        <!--<a href="" class="product-cat">NAM</a>-->
                        <a href="" class="product-name-1">${hanghoa.TEN}</a>
                        <div class="product-price-1">${hanghoa.GIA}</div>
                    </div>
                    <p>${muahang}</p>         
            ` }

                } else {
                    noidung = "Không có dữ liệu nhé !!";
                }
                $('.products-item').html(noidung);
                $('.nut-mua-ngay').click(function () {                
                    var mahang = $(this).data('cid');
                    form_muahang(mahang , data)
                })
                $('.buy-now').click(function () {
                    var mahang = $(this).data('cid');
                    console.log(mahang);
                })
            })
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
                      

                    Tên sản phẩm  : ${hh.TEN}  
                    <img style="width: 170px; " src="${hh.ANH}" />
                    Giá Tiền      : ${hh.GIA} 000 VNĐ
                    Số lượng      : <input type="int" id="soluong" placeholder="Số lượng " required>
                    
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
                                action: 'CH_ADD_HOA_DON',
                                mahoadon: mahoadon,
                                Trangthai: 'Chờ Xác Nhận',
                                tongtien: $('#soluong').val() * hh.GIA,
                                sdt: $('#sdtnhan').val(),
                            }


                            var data_bang_chi_tiet = {
                                action: 'CH_ADD_CT_HOA_DON',
                                mahoadon: mahoadon,
                                mahh: mahh,
                                soluong: $('#soluong').val(),
                                giaban: $('#giatien').val(),

                            }
                            $.post(api, data_bang_hoa_don, function (data) { })
                            $.post(api, data_bang_chi_tiet, function (data) { })


                        } else {

                            return;
                        }


                    }
                },
                cancel: {},
            },
        });

    };
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