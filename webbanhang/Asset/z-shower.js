﻿$(document).ready(function () {
  const api = '/api.ashx';
  const mp3 = '/mp3/';
  var log, data, logined = false, user_info;

  //--begin ck---
  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
  function getLocal(name) {
    return window.localStorage.getItem(name);
  }
  function setLocal(name, value) {
    window.localStorage.setItem(name, value);
  }
  function delLocal(name) {
    localStorage.removeItem(name);
  }
  function get_store(key) {
    var value = getCookie(key);
    if (value == null || value == '' || value == undefined) {
      value = getLocal(key);
    }
    return value;
  }

  //--end ck---
  function monitor(action, callback) {
    $.post(api,
      {
        action: action, //gửi đi action
      },
      function (json) {
        data = json;
        callback(json);
      }
    );
  }
  function control(action, id) {
    if (!logined) {
      alert_not_login();
      return;
    }

    $.post(api,
      {
        action: action,
        id: id
      },
      function (json) {
        if (json.ok) {
          dialog.close();
        } else {
          toastr["warning"](json.msg);
        }
      }
    );
  }
  function move_dialog() {
    var max = 200;
    var a = $('.jconfirm-box-container');
    max = a[0].parentElement.offsetParent.offsetHeight;
    function moving(i) {
      a.css("transform", "translate(0px, -" + i + "px)");
      if (i < max / 2 - 200) {
        setTimeout(function () { moving(i + 50) }, 1);
      }
    }
    //moving(1)
  }

  function alert_not_login() {
    if (!logined) {
      $.alert({
        title: '<div class="badge bg-primary">Bạn chưa đăng nhập</div>',
        content: 'Hãy đăng nhập để điều khiển',
        closeIcon: true,
        columnClass: 's',
        escapeKey: 'cancel',
        buttons: {
          ok: {
            text: 'Đăng nhập luôn',
            btnClass: 'btn-blue',
            keys: ['enter', 'n'],
            action: function () {
              do_login();
            }
          },
          cancel: {
            text: 'Cancel',
            keys: ['esc', 'c', 'C'],
            btnClass: 'btn-red',
          }
        }
      });
    }
  }
  function draw_init(json) {
    for (var item of json.data) {
      if (item.loai == 1) {
        $('#p' + item.id).addClass('nam');
        $('#p' + item.id).prop("title", "Phòng nam " + item.id)
      } else {
        $('#p' + item.id).addClass('nu');
        $('#p' + item.id).prop("title", "Phòng nữ " + item.id)
      }
      $('#p' + item.id).data('pid', item.id);
      $('#p' + item.id).html('<div class="time">P' + item.id + '</div>');
    }

    $('.nam,.nu').click(function () {
      if (!logined) {
        alert_not_login();
        return;
      }

      var id = $(this).data('pid');
      var tam = $(this).hasClass('tam');

      if (tam) {
        //đang có người tắm

        var dang_tam = {
          closeIcon: true,
          columnClass: 's',
          escapeKey: 'cancel',
          title: '<div class="badge bg-primary">Phòng&nbsp;' + id + '&nbsp;đã&nbsp;tắm&nbsp;xong?</div>',
          content: 'Xác nhận đã tắm xong phòng ' + id + ' ??',
          buttons: {
            ok: {
              btnClass: 'btn-blue',
              text: 'Tắm xong P.' + id,
              keys: ['enter', 't', 'x', 'T', 'X'],
              action: function () {
                control('tam_xong', id);
                return false; //ko đóng dialog, mà đợi ok mới đóng
              }
            },
            nham: {
              btnClass: 'btn-warning',
              text: '<span title="Nhầm có thể hủy trong vòng 2 phút">Nhầm</span>',
              keys: ['n', 'N'],
              isHidden: true,
              isDisabled: true,
              action: function () {
                control('huy_phong', id);
                return false; //ko đóng dialog, mà đợi ok mới đóng
              }
            },
            mp3: {
              btnClass: 'btn-info',
              text: 'Loa',
              keys: ['m', 'p', '3', 'M', 'P'],
              action: function () {
                Q.clear();
                Q.enqueue({ id: id, vip: 1 });
              }
            },
            cancel: {
              btnClass: 'btn-red',
              text: 'Cancel',
              keys: ['esc', 'c', 'C'],
              action: function () {
                dialog.close();
              }
            }
          },
          onContentReady: function () {
            move_dialog();
            for (var item of data.data) {
              if (item.id == id) {
                if (item.ss < 150) {
                  this.buttons.nham.show();
                  this.buttons.nham.enable();
                }
                else {
                  this.buttons.nham.hide();
                }
                break;
              }
            }
          }
        };

        var auto = false, nham = false;
        for (var item of data.data) {
          if (item.id == id) {
            if (item.ss < 150) nham = true;
            if (item.ss > (15 * 60)) auto = true;
            break;
          }
        }
        if (nham) {
          dang_tam.buttons.nham.isDisabled = false;
          dang_tam.buttons.nham.isHidden = false;
          dang_tam.autoClose = "nham|30000";
        } else if (auto) {
          dang_tam.autoClose = "ok|30000";
          dang_tam.buttons.ok.btnClass = "btn-blue btn-blink";
        }
        dialog = $.alert(dang_tam);
      } else {
        //phòng trống
        var phong_trong = {
          closeIcon: true,
          escapeKey: 'cancel',
          title: '<div class="badge bg-primary">Vào tắm Phòng ' + id + '?</div>',
          content: 'Xác nhận vào tắm mới?',
          autoClose: 'ok|30000',
          buttons: {
            ok: {
              btnClass: 'btn-blue btn-blink',
              text: 'Vào tắm P.' + id,
              keys: ['enter', 'v', 't', 'V', 'T'],
              action: function () {
                control('vao_tam', id);
                return false; //ko đóng dialog
              }
            },
            mp3: {
              btnClass: 'btn-info',
              text: 'Loa',
              keys: ['m', 'p', '3', 'M', 'P'],
              action: function () {
                Q.clear();
                Q.enqueue({ id: id, vip: 1 });
              }
            },
            cancel: {
              btnClass: 'btn-red jconfirm-closeIcon',
              text: 'Cancel',
              keys: ['esc', 'c', 'C'],
              action: function () {
                dialog.close();
              }
            }
          },
          onContentReady: function () {
            move_dialog();
          }
        };
        dialog = $.alert(phong_trong);
      }
    })
  }
  function format(s) {
    var m, h;
    m = s >= 60 ? parseInt(s / 60) : 0;
    h = m >= 60 ? parseInt(m / 60) : 0;
    m = m % 60;
    s = s % 60;

    if (m < 10) m = '0' + m;
    if (s < 10) s = '0' + s;
    if (h > 0) {
      if (h < 10) h = '0' + h;
      return h + ':' + m + ':' + s;
    } else {
      return m + ':' + s;
    }
  }
  class Queue {
    constructor() {
      this.queue = [];
    }

    enqueue(item) {
      return this.queue.unshift(item);
    }

    dequeue() {
      return this.queue.pop();
    }

    peek() {
      return this.queue[this.length - 1];
    }

    get length() {
      return this.queue.length;
    }

    isEmpty() {
      return this.queue.length === 0;
    }

    checkExist(item_check) {
      for (var item of this.queue) {
        if (item.id == item_check.id) return true;
      }
      return false;
    }

    enqueue2(item) {
      if (!this.checkExist(item)) this.enqueue(item);
    }
    clear() {
      for (var index in this.queue) {
        var item = this.queue[index];
        if (item.vip == undefined) {
          this.queue.splice(index, 1);
        }
      }
    }
    remove(itemX) {
      if (!this.isEmpty()) {
        for (var index in this.queue) {
          var item = this.queue[index];
          if (item.id == itemX.id) {
            this.queue.splice(index, 1);
            return;
          }
        }
      }
    }
  }
  var Q = new Queue();
  var gtts_playing = 0;               //biến đánh dấu xem có đang bận play ko
  function playSound(url, txt) {           //hàm này nhận 1 url audio để play
    if (gtts_playing) return;         //nếu đang bận playing thì thoát
    var audio = new Audio(url);     //tạo đối tượng để chuẩn bị play
    audio.play().then(() => {       //gọi play() và khi thực sự play thì:
      gtts_playing = 1;             //đánh dấu đang play        
      toastr["info"]("Đang nói ra loa, hãy bật loa!<br>" + txt);
    }).catch(e => {
      console.log(e);
      toastr["warning"]("Hãy bật loa và CLICK vào trình duyệt để cho phép nói ra loa nhé");
    })                           //hết hàm play
    audio.addEventListener("ended", //đăng ký sự kiện play xong thì:
      function () {                 //play xong thì hàm này chạy
        //bỏ đánh dấu bận => hết bận
        setTimeout(function () { gtts_playing = 0; }, 3000);//nghỉ 3 giây mới nói tiếp
      });                             //hết hàm xử lý stop
  }                                   //hết hàm playSound
  function play_tts(txt) {              //nhận txt là chuỗi cần tts
    $.post(mp3,  //gọi API tạo tts
      { text: txt },                     //truyền lên chuỗi cần tts
      function (json) {             //nhận về tên file mp3
        var tts = JSON.parse(json);
        playSound(mp3 + tts.fn, txt);  //play url=file này trong thư mục mp3
      });//end ajax post
  }
  function update_status(json) {
    if (json.ok) {
      var het_gio = [];
      for (var item of json.data) {
        if (item.tt == 1) {
          $('#p' + item.id).addClass('tam');
          $('#p' + item.id + ' .time').html('P' + item.id + ': ' + format(item.ss));
          if (item.ss > (15 * 60)) {
            $('#p' + item.id).addClass('over');
            //Q.enqueue2(item);
            het_gio.push(item.id);
          }
        } else {
          $('#p' + item.id).removeClass('tam').removeClass('over');
          $('#p' + item.id + ' .time').html('P' + item.id);
          Q.remove(item);
        }
      }

      if (het_gio.length > 0) {
        var id_tts = het_gio.join(', ');
        Q.clear();
        Q.enqueue2({ id: id_tts });
      }

      if (!gtts_playing && !Q.isEmpty()) {
        var item = Q.dequeue();
        var txt = 'Hết giờ phòng tắm ' + item.id;
        play_tts(txt);
      }
    } else {
      toastr["warning"](json.msg); //xem log khi có lỗi
    }
  }
  function thong_ke() {
    if (!logined) {
      alert_not_login();
      return;
    }
    $.post(api,
      {
        action: 'thong_ke',
      },
      function (json) {
        if (json.ok) {
          var content = '<table class="table table-hover">';
          content += '<thead><tr class="table-info fw-bold"><td align=center>STT</td><td align=center>Ngày</td><td align=center>Số lượt tắm</td><td align=center>Số lượt hủy</td></tr></thead><tbody>';
          var tam = 0, huy = 0, stt = 0;
          for (var item of json.data) {
            content += '<tr class="btn-report-detail" data-date="' + item.date + '"><td align=center>' + (++stt) + '</td><td align=center>' + item.date + '</td><td align=center><span class="badge rounded-pill bg-primary">' + item.tam + '</span></td><td align=center><span class="badge rounded-pill bg-danger">' + item.huy + '</span></td></tr>';
            tam += item.tam;
            huy += item.huy;
          }
          content += '<tr class="table-warning fw-bold"><td align=right colspan=2>Tổng:</td><td align=center><span class="badge rounded-pill bg-primary">' + tam + '</span></td><td align=center><span class="badge rounded-pill bg-danger">' + huy + '</span></td></tr>';
          content += '</tbody></table>';
          $.alert({
            closeIcon: true,
            escapeKey: 'ok',
            title: '<div class="badge bg-primary">Thống kê tổng hợp</div>',
            content: content,
            buttons: {
              ok: {
                text: 'Đóng lại',
                btnClass: 'btn-info',
              }
            },
            onContentReady: function () {
              move_dialog();
              $('.btn-report-detail').click(function () {
                var date = $(this).data('date');
                $.post(api,
                  {
                    action: 'report_detail',
                    date: date,
                  },
                  function (json) {
                    var content = '<table class="table table-hover table-striped">';
                    content += '<thead><tr class="table-info fw-bold">' +
                      '<td align=center>stt</td>' +
                      '<td align=center>Phòng</td>' +
                      '<td align=center>Giờ vào</td>' +
                      '<td align=center>Giờ ra</td>' +
                      '<td align=center>Số phút</td>' +
                      '<td align=center>Hủy</td>' +
                      '</tr></thead><tbody>';
                    var stt = 0;
                    for (var item of json.data) {
                      var t1 = item.tin.split(' '); if (t1.length > 1) t1 = t1[1];
                      var t2 = item.tout.split(' '); if (t2.length > 1) t2 = t2[1]; else t2 = '(đang tắm)';
                      var nhanh = ['bg-info','Tắm siêu nhanh'];
                      if (item.use > 10 && item.use <= 15) nhanh = ['bg-primary','Tắm nhanh'];
                      if (item.use > 15 && item.use <= 20) nhanh = ['bg-warning','Tắm hơi chậm'];
                      if (item.use > 20) nhanh = ['bg-danger','Tắm rất chậm'];
                      content += '<tr class="' + (item.huy ? 'table-danger' : '') + '">' +
                        '<td align=center>' + (++stt) + '</td>' +
                        '<td align=center><span class="badge rounded-pill ' + (item.loai ? 'bg-primary' : 'bg-info') + '">' + (item.loai ? 'Nam' : 'Nữ') + ' ' + item.pid + '</span></td>' +
                        '<td align=center>' + t1 + '</td>' +
                        '<td align=center>' + t2 + '</td>' +
                        '<td align=center><span class="badge rounded-pill ' + nhanh[0] + '" title="'+nhanh[1]+'">' + item.use + '</span></td>' +
                        '<td align=center>' + (item.huy ? 'Hủy' : '') + '</td>' +
                        '</tr>'
                    }
                    content += '</tbody></table>';
                    $.alert({
                      closeIcon: true,
                      columnClass: 'l',
                      escapeKey: 'ok',
                      title: '<div class="badge bg-primary">Thống kê chi tiết ngày ' + date + '</div>',
                      content: content,
                      buttons: {
                        ok: {
                          text: 'Đóng lại',
                          btnClass: 'btn-info',
                        }
                      }
                    });
                  }
                );
              });
            }
          });
        } else {
          toastr["warning"](json.msg);
        }
      }
    );
  }
  function admin_panel() {
    if (!logined) {
      alert_not_login();
      return;
    }
    $.alert({
      title: '<div class="badge bg-primary">Xin chào <b>' + user_info.fullname + '</b></div>',
      content: '<div id="list-user"></div><p>Các tính năng dành cho bạn</p>',
      closeIcon: true,
      columnClass: 'm',
      escapeKey: 'cancel',
      buttons: {
        add_user: {
          text: 'Thêm user',
          btnClass: 'btn-primary',
          isHidden: true,
          action: function () {
            alert('Nếu là admin thì hiện form thêm user mới');
            return false; //ko đóng dialog
          }
        },
        change_pw: {
          text: 'Đổi mật khẩu',
          btnClass: 'btn-blue',
          action: function () {
            alert('đổi mật khẩu của người dùng hiện tại, chưa code');
            return false; //ko đóng dialog
          }
        },
        cancel: {
          text: 'Close',
          keys: ['esc', 'c', 'C'],
          btnClass: 'btn-red',
        }
      },
      onContentReady: function () {
        if (user_info.role == 100)//nếu là admin
        {
          this.buttons.add_user.show();
          $.post(api, { action: 'list_user' }, function (json) {
            if (json.ok) {
              var s = '<h4>Danh sách user</h4>' +
                '<table class="table table-hover"><thead><tr class="table-info"><th>STT</th><th>uid</th><th>fullname</th><th>Role</th><th>Last login</th><th>Action</th></tr></thead><tbody>';
              var stt = 0;
              for (var item of json.data) {
                s += '<tr>';
                s += '<td align="center">' + (++stt) + '</td>';
                s += '<td>' + item.uid + '</td>';
                s += '<td>' + item.fullname + '</td>';
                s += '<td>' + item.rolename + '</td>';
                s += '<td>' + item.last + '</td>';
                var action = '<button class="btn btn-sm btn-warning btn-action-user" data-action="change-pw" data-uid="' + item.uid + '">PW</button>';
                action += ' <button class="btn btn-sm btn-danger btn-action-user" data-action="del-user" data-uid="' + item.uid + '">Del</button>';
                s += '<td>' + action + '</td></tr>';
                s += '</tr>';
              }
              s += '</tbody></table>';
              $('#list-user').html(s);
              $('.btn-action-user').click(function () {
                var action = $(this).data('action');
                var uid = $(this).data('uid');
                alert(['coding', action, uid,]);
              });
            }
          })
        }
      }
    });
  }
  function load_gui() {
    if (logined) {
      $('.login_info').html("Xin chào&nbsp;<b>" + user_info.fullname + "</b>");
      $('#cmdLogin').hide();
      $('#cmdLogout,.login_info, .btn-thong-ke').removeClass('not-show');
      $('#cmdLogout,.login_info, .btn-thong-ke').show();
      $('.login_info').click(function () { admin_panel(); });
    } else {
      $('.login_info').html('');
      $('#cmdLogin').removeClass('not-show');
      $('#cmdLogin').show();
      $('#cmdLogout').hide();
    }
  }
  function do_login() {
    $('#cmdLogin').addClass("active");
    let uidck = get_store('uid');
    if (!uidck) uidck = '';
    if (uidck === undefined) uidck = '';
    let dialogLogin = $.confirm({
      lazyOpen: true,
      closeIcon: true,
      title: '<div class="badge bg-primary"><i class="fa fa-key" aria-hidden="true"></i> Login system</div>',
      content: '' +
        '<form action="" class="formName">' +
        '<div class="form-group">' +
        '<label>Username:</label>' +
        '<input type="text" placeholder="Enter Username" class="uid form-control" value="' + uidck + '" required />' +
        '</div>' +
        '<div class="form-group">' +
        '<label>Password:</label>' +
        '<input type="password" placeholder="Enter password" class="pwd form-control" required />' +
        '</div>' +
        '</form>',
      escapeKey: 'cancel',
      buttons: {
        formSubmit: {
          text: 'Login',
          btnClass: 'btn-blue cmd-submit',
          action: function () {
            let uid = this.$content.find('.uid').val();
            let pwd = this.$content.find('.pwd').val();
            if (uid == '') {
              this.$content.find('.uid').focus();
              return false;
            }
            if (pwd == '') {
              this.$content.find('.pwd').focus();
              return false;
            }
            let dialog_wait_login = $.confirm({
              title: 'Submit and Process...',
              content: 'Please wait a few second...',
              buttons: {
                ok: {}
              }
            });
            $.post(api,
              {
                action: "do_login",
                uid: uid,
                pwd: pwd,
              },
              function (json) {
                dialog_wait_login.close();
                logined = json.ok;
                if (logined) {
                  user_info = json;
                  load_gui();
                  localStorage.logined = JSON.stringify(json);
                  setLocal("uid", json.uid)
                  setLocal("ck", json.cookie)
                  setCookie('uid', json.uid);
                  setCookie('ck', json.cookie, 30);
                  dialogLogin.close();
                } else {
                  load_gui();
                  $.confirm({
                    title: 'Warning',
                    escapeKey: 'ok',
                    content: json.msg,
                    autoClose: 'OK|5000',
                    escapeKey: 'OK',
                    buttons: {
                      OK: {
                        text: 'Close',
                        keys: ['enter', 't'],
                        btnClass: 'btn-red',
                        action: function () {
                        }
                      },
                    },
                    onDestroy: function () {
                      dialogLogin.$content.find('.pwd').focus();
                    }
                  })
                }
              });
            return false;
          }
        },
        cancel: {
          text: 'Close',
          btnClass: 'btn-red',
        },
      },
      onClose: function () {
        $('#cmdLogin').removeClass("active");
      },
      onContentReady: function () {
        //$('#cmdLogin').addClass("active");
        let self = this;
        let uid = get_store('uid');
        if (uidck == '')
          self.$content.find('.uid').focus();
        else
          self.$content.find('.pwd').focus();
        self.$content.find('.uid').keyup(function (event) {
          if (event.keyCode === 13) {
            if (self.$content.find('.uid').val() == '')
              this.$content.find('.uid').focus();
            else
              self.$content.find('.pwd').focus();
          }
        });
        self.$content.find('.pwd').keyup(function (event) {
          if (event.keyCode === 13) {
            if (self.$content.find('.uid').val() == '')
              this.$content.find('.uid').focus();
            else if (self.$content.find('.pwd').val() == '')
              this.$content.find('.pwd').focus();
            else {
              let x = $.find('.cmd-submit');
              x[0].click();
            }
          }
        });
      }
    });
    dialogLogin.open();
  }
  function do_logout() {
    //let ck = get_store('ck');
    //let uid = get_store('uid');
    $.post(api,
      {
        action: "do_logout",
        //uid: uid,
        //ck: ck,  //tự nó gửi đi theo đường ck
      },
      function (json) {
        if (json.ok) {
          logined = false;
          gui_first = 0;
          eraseCookie('ck');
          delLocal('ck');
          localStorage.clear();
          load_gui();
          window.location.href = "/";
        }
      });
  }
  function check_login() {
    let ck = get_store('ck');
    let uid = get_store('uid');
    if (ck != null && uid != null) {
      $.post(api,
        {
          action: "check_logined",
          //ck: ck,
          //uid: uid,  //tự nó gửi đi theo đường ck
        },
        function (json) {
          logined = json.ok;
          if (logined) {
            user_info = json;
            localStorage.logined = JSON.stringify(json);
            setLocal("uid", json.uid)
            setLocal("ck", json.cookie)
            setCookie('uid', json.uid);
            setCookie('ck', json.cookie, 30);
          }
          load_gui();
        });
    } else {
      logined = false;
      load_gui();
    }
  }
  function init() {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": true,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
    monitor('monitor', draw_init)
    setInterval(function () { monitor('monitor', update_status); }, 500);
    //ngăn menu phải
    if (document.addEventListener) {
      document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
      }, false);
    }
    $('.btn-thong-ke').click(function () { thong_ke(); });
    $('#cmdLogin').click(function () { do_login() });
    $('#cmdLogout').click(function () { do_logout(); });
    check_login(); //auto login
  }
  init();
}); //end ready