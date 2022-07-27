import { ClockIcon } from "@heroicons/react/outline";
import axios from "axios";
import React, { useState } from "react";
import chatIcon from "../../Assets/chat-icon.png";
import transaksiActiveIcon from "../../Assets/transaksi-admin-active.png";
import API_URL from "../../Helpers/API_URL";
import { fullDateGenerator } from "../../Helpers/dateGenerator";
import ModalPrescriptionService from "./ModalPrescriptionService";

function CardOrderAdmin({ data, getOrders }) {
  const [checked, setChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {
    status,
    id,
    transaction_code,
    date_requested,
    prescription_photo,
    expired_at,
    username,
  } = data;
  console.log(data);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const cancelOrder = async (id) => {
    try {
      await axios.patch(`${API_URL}/transaction/order/reject?id=${id}`);
    } catch (error) {
      console.log(error);
    }
  };
  const confirmlOrder = async (id) => {
    try {
      await axios.patch(`${API_URL}/transaction/order/confirm?id=${id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <ModalPrescriptionService
        isOpen={isOpen}
        closeModal={closeModal}
        data={data}
        getOrders={getOrders}
      />
      <div className="w-full h-72 border flex flex-col bg-white rounded-lg overflow-hidden shadow-custom">
        <div
          className={`w-full h-14 flex justify-between items-center border-l-8 px-7 duration-300 ${
            checked ? "border-primary" : "border-white"
          }`}
        >
          <div className="flex gap-x-2">
            <input
              type="checkbox"
              name=""
              id=""
              onChange={() => setChecked(!checked)}
              className="checkbox checkbox-primary"
              value={data}
            />
            <span className="font-bold">{status.split("-").join(" ")}</span>
            <span className="text-neutral-gray">/</span>
            <span className="font-bold">{transaction_code}</span>
            <span className="text-neutral-gray">/</span>
            <span className="font-bold text-gray-500 flex gap-x-2 items-center">
              <ClockIcon className="h-5 aspect-square" />
              {fullDateGenerator(date_requested)}
            </span>
          </div>
          <div className="flex gap-x-2">
            {(status === "Pengecekan-Resep" || status === "Diproses") && (
              <>
                <span className="font-bold">Respon Sebelum</span>
                <div className="bg-yellow-200 rounded flex gap-x-2 items-center font-semibold text-red-600 text-xs px-2">
                  <ClockIcon className="h-4 aspect-square" />
                  {fullDateGenerator(expired_at)}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="border-b border-neutral-gray" />
        <div className="flex flex-col p-6 gap-y-3">
          <div className="flex h-20 w-full gap-x-8">
            <div className="w-1/3 flex gap-x-6">
              <div className="h-full aspect-square border rounded object-cover overflow-hidden">
                <img
                  src={
                    transaction_code.split()[1] === "L"
                      ? ""
                      : API_URL + prescription_photo
                  }
                  alt="photo"
                />
              </div>
              <div className="w-full h-full">
                {status == "Pengecekan-Resep" && "Lakukan Pengecekan Resep"}
                {status == "Pesanan-Diterima" &&
                  "Menunggu Pembayaran Dari User"}
              </div>
            </div>
            <div className="border-r h-full" />
            <div className="w-2/3 flex gap-x-8">
              <div className="w-1/3 flex flex-col">
                <h3 className="font-bold">Pembeli</h3>
                <p>{username}</p>
              </div>
              {status != "Pengecekan-Resep" && status != "Pesanan-Diterima" && (
                <>
                  <div className="w-1/3 border">Alamat</div>
                  <div className="w-1/3 border">Kurir</div>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center h-12 w-full px-5 font-bold">
            {status != "Pengecekan-Resep" && status != "Pesanan-Diterima" && (
              <>
                <div className="w-1/2">Total Harga</div>
                <div className="w-1/2 text-right">Price</div>
              </>
            )}
          </div>
          <div className="flex h-8 justify-between items-center">
            <div className="h-full flex gap-x-5">
              <button className="button-outline rounded-full flex gap-x-2 text-sm px-5">
                <img src={chatIcon} alt="" className="h-full scale-125" />
                <span>Chat Pembeli</span>
              </button>
              {status != "Pengecekan-Resep" && (
                <button className="button-outline rounded-full flex gap-x-2 text-sm px-5">
                  <img src={transaksiActiveIcon} alt="" className="h-full" />
                  <span>Detail Pemesanan</span>
                </button>
              )}
            </div>
            <div className="h-full flex gap-x-5 w-1/3">
              {(status == "Pengecekan-Resep" || status == "Diproses") && (
                <>
                  <button
                    className="button-outline w-1/2"
                    onClick={() => cancelOrder(id)}
                  >
                    Tolak Pesanan
                  </button>
                  {status == "Pengecekan-Resep" && (
                    <button
                      className="button-primary w-1/2"
                      onClick={openModal}
                    >
                      Buat Salinan Resep
                    </button>
                  )}
                  {status == "Diproses" && (
                    <button
                      className="button-primary w-1/2"
                      onClick={() => confirmlOrder(id)}
                    >
                      Terima Pesanan
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardOrderAdmin;
