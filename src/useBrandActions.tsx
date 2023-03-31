import { useMemo, useState } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { Brand } from "../Interfaces";
import initialBrands from "../data/brandOrders.json";
// useBrandActions is a hook that facilitates stateful interactions with BrandComponent.tsx

interface UseBrandActionsParams {
  brands: Brand[];
  setBrands: (brands: Brand[]) => void;
}

export const useBrandActions = ({
  brands,
  setBrands,
}: UseBrandActionsParams) => {
  const handleAddOrder = (brandIndex: number) => {
    const newBrands = _.cloneDeep(brands);
    // Add new order
    newBrands[brandIndex].orders.push({
      date: new Date().toISOString().slice(0, 10),
      price: 0,
    });

    toast(`Added order to ${newBrands[brandIndex].name}`, {
      type: "success",
    });
    setBrands(newBrands);
  };

  const handleDeleteOrder = (brandIndex: number, orderIndex: number) => {
    const newBrands = _.cloneDeep(brands);
    newBrands[brandIndex].orders.splice(orderIndex, 1);

    toast(`Deleted order ${orderIndex} from "${newBrands[brandIndex].name}" `, {
      type: "error",
    });
    setBrands(newBrands);
  };

  const handleAddBrand = (): void => {
    const newBrands = _.cloneDeep(brands);

    newBrands.push({
      name: "",
      orders: [],
    });

    toast(`Added a new brand`, { type: "success" });
    setBrands(newBrands);
  };

  const handleDeleteBrand = (brandIndex: number) => {
    const newBrands = _.cloneDeep(brands);
    newBrands.splice(brandIndex, 1);

    toast(`Deleted Brand "${brands[brandIndex].name}"`, { type: "error" });
    setBrands(newBrands);
  };

  return {
    handleAddOrder,
    handleDeleteOrder,
    handleAddBrand,
    handleDeleteBrand,
  };
};
