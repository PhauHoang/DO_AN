using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using static System.Collections.Specialized.BitVector32;
using SuatAn;

namespace WebBanHang
{
    public partial class api : System.Web.UI.Page
    {
        void xu_ly_mat_hang(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand cm = db.GetCmd("SP_MATHANG", action);
            switch (action)
            {
                case "MATHANG_LIST":
                    break;
            }
            string json = (string)db.Scalar(cm);
            Response.Write(json);
        }

        void xulynguoidung(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand cm = db.GetCmd("[SP_USER_LOGIN]", action);
            switch (action)
            {
                case "login":
                    cm.Parameters.Add("@ID", SqlDbType.NVarChar, 50).Value = Request["id"];
                    cm.Parameters.Add("@MATKHAU", SqlDbType.NVarChar, 50).Value = Request["pw"];
                    break;

            }
            string json = (string)db.Scalar(cm);
            Response.Write(json);
        }
        void xu_ly_khach_hang(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand cm = db.GetCmd("[SP_KHACHHANG]", action);
            switch (action)
            {
                

                case "list":
                case "add":
                case "edit":
                    cm.Parameters.Add("@MAKH", SqlDbType.Int).Value = Request["makh"];
                    cm.Parameters.Add("@TENKH", SqlDbType.NVarChar, 50).Value = Request["name"];
                    cm.Parameters.Add("@DIACHI", SqlDbType.NVarChar, 50).Value = Request["address"];
                    cm.Parameters.Add("@SDT", SqlDbType.Int).Value = Request["phone"];
                    break;
                case "delete":
                    cm.Parameters.Add("@MAKH", SqlDbType.Int).Value = Request["MAKH"];                                     
                    break;
            }
            string json = (string)db.Scalar(cm);
            Response.Write(json);
        }
        void xulybanhang(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand cm = db.GetCmd("[SP_BAN_HANG]", action);
            switch (action)
            {
                case "BH_THEM_KHACHHANG":
                    cm.Parameters.Add("@MAKH", SqlDbType.NVarChar, 50).Value = Request["MAKH"];
                    cm.Parameters.Add("@TEN_KH", SqlDbType.NVarChar, 50).Value = Request["TENKH"];
                    cm.Parameters.Add("@DIACHI", SqlDbType.NVarChar, 50).Value = Request["DIACHI"];
                    cm.Parameters.Add("@SDT", SqlDbType.Int).Value = Request["giaban"];
                    break;
                case "BH_THEM_DONDATHANG":
                    cm.Parameters.Add("@MAKH", SqlDbType.NVarChar, 50).Value = Request["MAKH"];
                     cm.Parameters.Add("@SO_HD", SqlDbType.NVarChar ,50).Value = Request["SOHOADON"];
                    break;
                case "BH_THEM_CHITIETDATHANG":
                     cm.Parameters.Add("@SO_HD", SqlDbType.NVarChar ,50).Value = Request["SOHOADON"];
                    cm.Parameters.Add("@MAHH", SqlDbType.NVarChar, 50).Value = Request["MAHH"];
                    cm.Parameters.Add("@SOLUONG", SqlDbType.Int).Value = Request["soluong"];
                    cm.Parameters.Add("@DONGIA", SqlDbType.Int).Value = Request["giaban"];
                    break;
                case "BH_DANH_SACH_DON_DAT_HANG":
                    break;

            }
            string json = (string)db.Scalar(cm);
            Response.Write(json);
        }


        protected void Page_Load(object sender, EventArgs e)
        {

            string action = Request["action"];
            switch (action)
            {
                
                case "list":
                case "add":
                case "edit":
                case "delete":
                    xu_ly_khach_hang(action);
                    break;
                case "MATHANG_LIST":
                    xu_ly_mat_hang(action);
                    break;
                case "BH_THEM_KHACHHANG":
                case "BH_THEM_DONDATHANG":
                case "BH_THEM_CHITIETDATHANG":
                     case "BH_DANH_SACH_DON_DAT_HANG":
                    xulybanhang(action);
                   break;
                case "login":
                    xulynguoidung(action);
                    break;


            }
        }
    }
        
}

