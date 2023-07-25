import React, {useEffect} from 'react';
import {default as test} from "./testData.json"
import {Budget} from "../../types/Budget";
import CategoryBudgetItem from "../../elements/CategoryBudgetItem";
import TimeScopePanel from "../../components/TimeScopePanel/TimeScopePanel";
import {useAppDispatch, useAppSelector} from "../../hooks/useAppDispatch";
import {fetchBudgetAction} from "../../store/Budgets/Budgets.slice";


const Budgets = () => {
    // const data = test as Budget[]
    // const budgeted = data.filter(item => item.limit > 0)
    // const nonBudgeted = data.filter(item => item.limit === 0)
    const {budgetList} = useAppSelector(state => state.Budgets)

    const budgeted = budgetList.filter(item => item.limit > 0)
    const nonBudgeted = budgetList.filter(item => item.limit === 0)
    const dispatch = useAppDispatch()

    useEffect(()=>{
        console.warn("+")
        dispatch(fetchBudgetAction(""))
    },[])

    return (
        <main className={"budgets"}>
            <TimeScopePanel />
            <div className={"row-title"}>Budgeted Categories</div>
            {
                budgeted.map(item => <CategoryBudgetItem key={item.id} budget={item}/>)
            }
            <div className={"row-title"}>Not Budgeted Categories</div>
            {
                nonBudgeted.map(item => <CategoryBudgetItem key={item.id} budget={item}/>)
            }
        </main>
    );
};

export default Budgets;