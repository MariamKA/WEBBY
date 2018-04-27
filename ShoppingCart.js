<! DOCTYPE HTML>
<html>
<head>
<title> Shopping CartJSP</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<script type="text/javascript">

<!--CartItemBean-->
package in.techfreaks.shoppingcart.beans;
 
public class CartItemBean {
    private String strPartNumber;
    private String strModelDescription;
    private double dblUnitCost;
    private int iQuantity;
    private double dblTotalCost;
     
    public String getPartNumber() {
        return strPartNumber;
    }
    public void setPartNumber(String strPartNumber) {
        this.strPartNumber = strPartNumber;
    }
    public String getModelDescription() {
        return strModelDescription;
    }
    public void setModelDescription(String strModelDescription) {
        this.strModelDescription = strModelDescription;
    }
    public double getUnitCost() {
        return dblUnitCost;
    }
    public void setUnitCost(double dblUnitCost) {
        this.dblUnitCost = dblUnitCost;
    }
    public int getQuantity() {
        return iQuantity;
    }
    public void setQuantity(int quantity) {
        iQuantity = quantity;
    }
    public double getTotalCost() {
        return dblTotalCost;
    }
    public void setTotalCost(double dblTotalCost) {
        this.dblTotalCost = dblTotalCost;
    }
}



<!--Cart-->

package in.techfreaks.shoppingcart.beans;
 
import java.util.ArrayList;
 
 
public class CartBean {
 private ArrayList alCartItems = new ArrayList();
 private double dblOrderTotal ;
  
 public int getLineItemCount() {
  return alCartItems.size();
 }
  
 public void deleteCartItem(String strItemIndex) {
  int iItemIndex = 0;
  try {
   iItemIndex = Integer.parseInt(strItemIndex);
   alCartItems.remove(iItemIndex - 1);
   calculateOrderTotal();
  } catch(NumberFormatException nfe) {
   System.out.println("Error while deleting cart item: "+nfe.getMessage());
   nfe.printStackTrace();
  }
 }
  
 public void updateCartItem(String strItemIndex, String strQuantity) {
  double dblTotalCost = 0.0;
  double dblUnitCost = 0.0;
  int iQuantity = 0;
  int iItemIndex = 0;
  CartItemBean cartItem = null;
  try {
   iItemIndex = Integer.parseInt(strItemIndex);
   iQuantity = Integer.parseInt(strQuantity);
   if(iQuantity>0) {
    cartItem = (CartItemBean)alCartItems.get(iItemIndex-1);
    dblUnitCost = cartItem.getUnitCost();
    dblTotalCost = dblUnitCost*iQuantity;
    cartItem.setQuantity(iQuantity);
    cartItem.setTotalCost(dblTotalCost);
    calculateOrderTotal();
   }
  } catch (NumberFormatException nfe) {
   System.out.println("Error while updating cart: "+nfe.getMessage());
   nfe.printStackTrace();
  }
   
 }
  
 public void addCartItem(String strModelNo, String strDescription,
String strUnitCost, String strQuantity) {
  double dblTotalCost = 0.0;
  double dblUnitCost = 0.0;
  int iQuantity = 0;
  CartItemBean cartItem = new CartItemBean();
  try {
   dblUnitCost = Double.parseDouble(strUnitCost);
   iQuantity = Integer.parseInt(strQuantity);
   if(iQuantity>0) {
    dblTotalCost = dblUnitCost*iQuantity;
    cartItem.setPartNumber(strModelNo);
    cartItem.setModelDescription(strDescription);
    cartItem.setUnitCost(dblUnitCost);
    cartItem.setQuantity(iQuantity);
    cartItem.setTotalCost(dblTotalCost);
    alCartItems.add(cartItem);
    calculateOrderTotal();
   }
    
  } catch (NumberFormatException nfe) {
   System.out.println("Error while parsing from String to primitive types: "+nfe.getMessage());
   nfe.printStackTrace();
  }
 }
  
 public void addCartItem(CartItemBean cartItem) {
  alCartItems.add(cartItem);
 }
  
 public CartItemBean getCartItem(int iItemIndex) {
  CartItemBean cartItem = null;
  if(alCartItems.size()>iItemIndex) {
   cartItem = (CartItemBean) alCartItems.get(iItemIndex);
  }
  return cartItem;
 }
  
 public ArrayList getCartItems() {
  return alCartItems;
 }
 public void setCartItems(ArrayList alCartItems) {
  this.alCartItems = alCartItems;
 }
 public double getOrderTotal() {
  return dblOrderTotal;
 }
 public void setOrderTotal(double dblOrderTotal) {
  this.dblOrderTotal = dblOrderTotal;
 }
  
 protected void calculateOrderTotal() {
  double dblTotal = 0;
  for(int counter=0;counter<alCartItems.size();counter++) {
   CartItemBean cartItem = (CartItemBean) alCartItems.get(counter);
   dblTotal+=cartItem.getTotalCost();
    
  }
  setOrderTotal(dblTotal);
 }
 
}


<!--Control-->

package in.techfreaks.shoppingcart.servlet;
 
import in.techfreaks.shoppingcart.beans.CartBean;
 
import java.io.IOException;
 
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
 
public class CartController extends HttpServlet {
  
 //public static final String addToCart
  
 public void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
 
  String strAction = request.getParameter("action");
   
   
  if(strAction!=null && !strAction.equals("")) {
   if(strAction.equals("add")) {
    addToCart(request);
   } else if (strAction.equals("Update")) {
    updateCart(request);
   } else if (strAction.equals("Delete")) {
    deleteCart(request);
   }
  }
  response.sendRedirect("../ShoppingCart.jsp");
 }
  
 protected void deleteCart(HttpServletRequest request) {
  HttpSession session = request.getSession();
  String strItemIndex = request.getParameter("itemIndex");
  CartBean cartBean = null;
   
  Object objCartBean = session.getAttribute("cart");
  if(objCartBean!=null) {
   cartBean = (CartBean) objCartBean ;
  } else {
   cartBean = new CartBean();
  }
  cartBean.deleteCartItem(strItemIndex);
 }
  
 protected void updateCart(HttpServletRequest request) {
  HttpSession session = request.getSession();
  String strQuantity = request.getParameter("quantity");
  String strItemIndex = request.getParameter("itemIndex");
  
  CartBean cartBean = null;
   
  Object objCartBean = session.getAttribute("cart");
  if(objCartBean!=null) {
   cartBean = (CartBean) objCartBean ;
  } else {
   cartBean = new CartBean();
  }
  cartBean.updateCartItem(strItemIndex, strQuantity);
 }
  
 protected void addToCart(HttpServletRequest request) {
  HttpSession session = request.getSession();
  String strModelNo = request.getParameter("modelNo");
  String strDescription = request.getParameter("description");
  String strPrice = request.getParameter("price");
  String strQuantity = request.getParameter("quantity");
   
  CartBean cartBean = null;
   
  Object objCartBean = session.getAttribute("cart");
 
  if(objCartBean!=null) {
   cartBean = (CartBean) objCartBean ;
  } else {
   cartBean = new CartBean();
   session.setAttribute("cart", cartBean);
  }
   
  cartBean.addCartItem(strModelNo, strDescription, strPrice, strQuantity);
 }
 
}

</script>
</head>
<body>

</body>

</html>
