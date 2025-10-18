import React from "react";
import OrderForm from "../components/OrderForm";
import InventoryInfo from "../components/InventoryInfo";
import AllOrders from "../components/AllOrders";
import FlourManager from "../components/FlourManager";

const Dashbord = () => {
  return (
    <div>
      <InventoryInfo />
      <FlourManager />
      <div className="maindah">
        <div>
          <OrderForm />
        </div>
        <AllOrders />
      </div>
    </div>
  );
};

export default Dashbord;
