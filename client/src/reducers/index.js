import { combineReducers } from "redux";
import { cartReducer } from "./cartReducer";
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderListMyReducer,
  orderListAllReducer,
  orderDeliverReducer,
} from "./orderReducer";
import {
  productCreateReducer,
  productCreateReviewReducer,
  productDeleteReducer,
  productDetailsReducer,
  productListReducer,
  productUpdateReducer,
  topProductReducer,
} from "./productReducer";
import {
  listUsersReducer,
  userDeleteReducer,
  userDetailsReducer,
  userLoginReducer,
  userRegisterReducer,
  userUpdateProfileReducer,
  userUpdateReducer,
} from "./userReducer";

const rootReducers = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  topProducts: topProductReducer,
  productUpdate: productUpdateReducer,
  productReviewCreate: productCreateReviewReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userList: listUsersReducer,
  userUpdateProfile: userUpdateProfileReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
  orderListMy: orderListMyReducer,
  orderListAll: orderListAllReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
});

export default rootReducers;
