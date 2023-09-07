import React, {FC, useEffect, useState} from 'react';
import {Budget, BudgetToCreate, BudgetToEdit} from "../../types/Budget";
import Dropdown, {Option} from "../../elements/Dropdown";
import {useAppDispatch, useAppSelector} from "../../hooks/useAppDispatch";
import {createBudgetAction, editBudgetAction} from "../../store/Budgets/Budgets.slice";
import {FETCH_CATEGORIES} from "../../store/Category/Category.slice";
import InputWithTitle from "../../elements/InputWithTitle";

interface Props {
  budget?: Budget
  openPopupHandle(): void
}

function pickBudgetForWrite(budget: Budget): BudgetToEdit {
  const {categories, spent, ...budgetWrite} = budget;
  return {...budgetWrite, categoryId: categories.map(x => x.id)};
}

const emptyCreateBudget: BudgetToCreate = {
  limit: 0,
  title: "",
  categoryId: []
}


const BudgetWrite: FC<Props> = ({budget, openPopupHandle}) => {
  const [editableBudget, setBudget] = useState<BudgetToEdit | BudgetToCreate>(emptyCreateBudget)
  const {categories} = useAppSelector((state) => state.Category);
  const categoryItems = categories.filter(x => x.type === 'expense')


  const [pickedCategories, setPickedCategories] = useState<string[]>([""])
  const categoryOptions: Option[] = categoryItems.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const dispatch = useAppDispatch()

  const handleLimitInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget({...editableBudget, limit: e.target.value.length ? parseInt(e.target.value) : 0})
  }

  const handleTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget({...editableBudget, title: e.target.value})
  }

  const handleCancel = () => {
    setBudget(budget ? pickBudgetForWrite(budget) : emptyCreateBudget)
    openPopupHandle()
  }

  const handleSafe = () => {
    const budgetToSafe: BudgetToEdit | BudgetToCreate = {
      ...editableBudget,
      categoryId: pickedCategories.filter(x => x.length > 0)
    }

    if (!!budget)
      dispatch(editBudgetAction(budgetToSafe as BudgetToEdit))
    else
      dispatch(createBudgetAction(budgetToSafe as BudgetToCreate))
    openPopupHandle()
  }

  const handleCategoryChange = (index: number, option: Option) => {
    setPickedCategories(prevState => prevState.map((elem, i) => i === index ? option.value : elem))
  };
  const handleAddCategory = () => {
    setPickedCategories(prevState => [...prevState, ""])
  }
  const handleRemoveCategory = (index: number) => {
    setPickedCategories(prevState => prevState.filter((_, i) => i !== index))
  }

  useEffect(() => {
    dispatch(FETCH_CATEGORIES());
  }, [dispatch])

  useEffect(() => {
    if (!budget)
      return
    setBudget(pickBudgetForWrite(budget))
    setPickedCategories(budget?.categories.map(item => item.id))
  }, [budget])


  return (
    <>
      <div style={{background: budget?.categories[0].color}}
           className={"popup__header"}>{budget?.title}</div>
      <div className={"popup__fields"}>
        <InputWithTitle
          type={"text"}
          placeholder={"Title"}
          onChange={handleTitleInput}
          value={editableBudget.title!}/>

        <InputWithTitle
          type={"number"}
          placeholder={"Budget"}
          onChange={handleLimitInput}
          value={editableBudget.limit ? editableBudget.limit : ""}/>

        {
          pickedCategories.map((item, index) =>
            <div key={index} className={"popup__row"}>
              <Dropdown
                title={"Category"}
                selectHandler={(option) => {
                  handleCategoryChange(index, option)
                }}
                options={categoryOptions}
                defaultOptionIndex={
                  (() => {
                    const i = categoryOptions.findIndex((x) => x.value === item)
                    return i >= 0 ? i + 1 : undefined
                  })()
                }
              />
              {index !== 0 && <div onClick={() => handleRemoveCategory(index)}>—</div>}
            </div>
          )
        }

        <button onClick={handleAddCategory} className={'button category-add'}>Add Category</button>

      </div>

      <div className={"popup__row"}>
        <button onClick={() => {
          handleSafe()
        }} className={"button"}>
          Save
        </button>
        <button onClick={() => {
          handleCancel()
        }} className={"button"}>
          Cancel
        </button>
      </div>
    </>
  );
};

export default BudgetWrite;