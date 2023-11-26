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
            SqlCommand cm = db.GetCmd("SP_USER_LOGIN", action);
            switch (action)
            {
                case "list":
                   
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
                    cm.Parameters.Add("@SDT", SqlDbType.NVarChar, 10).Value = Request["phone"];
                    break;
                case "delete":
                    cm.Parameters.Add("@MAKH", SqlDbType.Int).Value = Request["MAKH"];                                     
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
                //case "list":
                //case "delete":
                //case "add":             
                //    xu_ly_mat_hang(action);
                ////break;
                case "list":
                case "add":
                case "edit":
                case "delete":

                    xu_ly_khach_hang(action);
                    break;
                case "MATHANG_LIST":
                    xu_ly_mat_hang(action);
                    break;
            }
        }
    }
        
}

