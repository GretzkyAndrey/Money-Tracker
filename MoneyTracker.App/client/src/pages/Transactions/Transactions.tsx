import React, {useState} from 'react';
import TransactionList from "../../components/TransactionList/TransactionList";
import TransactionCreate from "../../components/TransactionCreate/TransactionCreate";


import {default as test} from "../../components/TransactionList/testData.json"


const tmpFunc = (filter: "income" | "expense") => {
    const data = test.filter(item => item.category.type == filter) as Transaction[]
    return data.reduce((acc, item) => acc + item.amount, 0)
}

const Transactions = () => {
    const expense = tmpFunc("expense")
    const income = tmpFunc("income")

    const [defaultTransaction, setDefaultTransaction] = useState<"expense" | "income" | "transfer">("expense")

    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState<boolean>(false)
    const handlePopupOpen = () => {
        setIsCreatePopupOpen(prevState => !prevState)
    }


    return (
        <main>
            {
                isCreatePopupOpen &&
                <TransactionCreate transactionDefaultType={defaultTransaction} openPopupHandle={handlePopupOpen}/>
            }
            <div className={"transaction-sums"}>
                <div onClick={() => {
                    handlePopupOpen()
                    setDefaultTransaction("income")
                }} className={"transaction-sums__income"}>+{income} $
                </div>
                <div onClick={() => {
                    handlePopupOpen()
                    setDefaultTransaction("expense")
                }} className={"transaction-sums__expense"}>{expense} $
                </div>
            </div>
            <TransactionList/>
            {
                !isCreatePopupOpen &&
                <div onClick={() => {
                    handlePopupOpen()
                }} className={"new-transaction button"}> + </div>
            }
        </main>
    );
};

export default Transactions;