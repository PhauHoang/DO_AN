using SuatAn;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace webbanhang
{
    public partial class api : System.Web.UI.Page
    {
        void xuly_nguoidung(string action)
            {
                //khai báo biến db thuộc lớp SqlServer
                SqlServer db = new SqlServer();
                SqlCommand cm = db.GetCmd("SP_USER", action); //tạo cm với "SP_Company" và @action từ method GetCmd của db
                switch (action)
                {
                    //2 loại này truyền 5 tham số chung
                    case "US_login":
                        cm.Parameters.Add("@User_Name", SqlDbType.NVarChar, 50).Value = Request["User_Name"];
                        cm.Parameters.Add("@pw", SqlDbType.NVarChar, 50).Value = Request["pw"];
                        break;

                    case "US_LIST":
                        break;

                    case "US_Xoa":
                        cm.Parameters.Add("@id", SqlDbType.NVarChar, 50).Value = Request["id"];
                        break;
                    case "US_add":
                        cm.Parameters.Add("@User_Name", SqlDbType.NVarChar, 50).Value = Request["User_Name"];
                        cm.Parameters.Add("@hodem", SqlDbType.NVarChar, 50).Value = Request["hodem"];
                        cm.Parameters.Add("@ten", SqlDbType.NVarChar, 50).Value = Request["ten"];
                        cm.Parameters.Add("@pw", SqlDbType.NVarChar, 50).Value = Request["pw"];
                        cm.Parameters.Add("@diachi", SqlDbType.NVarChar, 50).Value = Request["diachi"];
                        cm.Parameters.Add("@sdt", SqlDbType.Int).Value = Request["SDT"];
                        break;

                    case "US_edit":
                        cm.Parameters.Add("@id", SqlDbType.Int).Value = Request["id"];
                        cm.Parameters.Add("@User_Name", SqlDbType.NVarChar, 50).Value = Request["User_Name"];
                        cm.Parameters.Add("@hodem", SqlDbType.NVarChar, 50).Value = Request["hodem"];
                        cm.Parameters.Add("@ten", SqlDbType.NVarChar, 50).Value = Request["ten"];
                        cm.Parameters.Add("@diachi", SqlDbType.NVarChar, 50).Value = Request["diachi"];
                        cm.Parameters.Add("@sdt", SqlDbType.Int).Value = Request["SDT"];
                        break;
                }
                string json = (string)db.Scalar(cm); //thuc thi SqlCommand cm này để thu về json
                Response.Write(json); //trả json về trình duyệt
            }


            void xuly_cuahang(string action)
            {
                SqlServer db = new SqlServer();
                SqlCommand cm = db.GetCmd("SP_Cuahang", action); //tạo cm với "SP_Company" và @action từ method GetCmd của db
                switch (action)
                {
                    case "CH_list_banh":
                        break;

                    case "CH_list_hoa_don":
                        break;

                    case "CH_list_hoa_don_hoan_thanh":
                        break;
                    case "CH_chi_tiet_hoa_don":
                        cm.Parameters.Add("@mahoadon", SqlDbType.NVarChar, 50).Value = Request["mahoadon"];
                        break;

                    case "CH_add_hoa_don":
                        cm.Parameters.Add("@mahoadon", SqlDbType.NVarChar, 50).Value = Request["mahoadon"];
                        cm.Parameters.Add("@tennguoinhan", SqlDbType.NVarChar, 50).Value = Request["Tennguoinhan"];
                        cm.Parameters.Add("@diachinhan", SqlDbType.NVarChar, 50).Value = Request["diachinguoinhan"];
                        cm.Parameters.Add("@makhachhang", SqlDbType.NVarChar, 50).Value = Request["MaKH"];
                        cm.Parameters.Add("@trangthai", SqlDbType.NVarChar, 50).Value = Request["Trangthai"];
                        cm.Parameters.Add("@tongtien", SqlDbType.Int).Value = Request["tongtien"];
                        break;
                    case "CH_add_ct_hoa_don":
                        cm.Parameters.Add("@mahoadon", SqlDbType.NVarChar, 50).Value = Request["mahoadon"];
                        cm.Parameters.Add("@mabanh", SqlDbType.NVarChar, 50).Value = Request["mabanh"];
                        cm.Parameters.Add("@soluong", SqlDbType.Int).Value = Request["soluong"];
                        cm.Parameters.Add("@giaban", SqlDbType.Int).Value = Request["giaban"];
                        break;
                }
                string json = (string)db.Scalar(cm); //thuc thi SqlCommand cm này để thu về json
                Response.Write(json); //trả json về trình duyệt
            }

            protected void Page_Load(object sender, EventArgs e)
            {
                string action = Request["action"];
                switch (action)
                {
                    case "US_LIST":
                case "US_login":
                    case "US_Xoa":
                    case "US_add":
                    case "US_edit":
                        xuly_nguoidung(action);
                        break;
                    case "CH_list_banh":
                    case "CH_list_hoa_don":
                    case "CH_list_hoa_don_hoan_thanh":
                    case "CH_chi_tiet_hoa_don":
                    case "CH_add_hoa_don":
                    case "CH_add_ct_hoa_don":
                        xuly_cuahang(action);
                        break;
                }
            
        }
    }
}