import { Epic, ofType } from "redux-observable";
import { from, map, mergeMap } from "rxjs";
import { store } from "../store";
import { NotificationReducer } from "./Reducers/NotificationReducer";
import { GraphQlEndpoint } from "../../api/queries/tmp";

import { CategoryItemReducer } from "./Reducers/CategoryItemsReducer";
import { ICategoryType } from "../../types/ICategoryType";

const { SHOW_ERROR_MESSAGE } = NotificationReducer.actions;
const { FETCH_CATEGORIES, FETCH_CATEGORIES_SUCCESS, FETCH_CATEGORIES_ERROR } =
  CategoryItemReducer.actions;
  // async function searchGoogle(name: string) {
  //   const API_KEY = 'AIzaSyD4dx6gGH-nVmxlgU6hFw1gPUanrE2J4to';
  //   const searchTerm = `${name} svg`;
  //   const cx = 'd534d390256ca462e';
  
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 10)); 
  
  //     const response = await fetch(
  //       'https://www.googleapis.com/customsearch/v1?q=' +
  //       encodeURIComponent(searchTerm) +
  //       '&cx=' +
  //       cx +
  //       '&key=' +
  //       API_KEY
  //     );
  //     const data = await response.json();
  //     console.log(data);
  //     const imageUrl = data?.items[0]?.pagemap?.cse_image[0]?.src;
  //     return imageUrl;
  //   } catch (error) {
  //     console.error('Error searching Google:', error);
  //   }
  // }
  
  export const CategoryItemsEpic: Epic<any, any, any> = (action$, state$) => {
    const categoryQuery = (page: number, countOfElements: number, dateTimeTo: string | null) => {

      return `
      {
        category {
          getCategories {
            id
            name
            type
            isActive
          }
        }
      }
      `;
    };
  
    return action$.pipe(
      ofType(FETCH_CATEGORIES),
      mergeMap((action) => {
        const { page, countOfElements, dateTimeTo } = action.payload;
  
        return from(
          fetch(GraphQlEndpoint, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              query: categoryQuery(page, countOfElements, dateTimeTo),
            }),
          })
        ).pipe(
          mergeMap((response) =>
            from(response.json()).pipe(
              mergeMap((data: any) => {
              
                if (data.errors) {
                  store.dispatch(SHOW_ERROR_MESSAGE(data.errors[0].message));
                  return [FETCH_CATEGORIES_ERROR(data.errors[0].message)];
                } else {
                  const items = data.data.category.getCategories;
                  const newItems: ICategoryType[] = items.map((item: ICategoryType) => ({
                    name: item.name,
                    type: item.type,
                    id: item.id,
                    isActive: item.isActive,
                    // icon: searchGoogle(item.name)
                  }));
                
                  return [
                    FETCH_CATEGORIES_SUCCESS({
                      categories: newItems,
                    }),
                  ];
                }
              })
            )
          )
        );
      })
    );
  };
  


const {
  EDIT_CATEGORY,
  EDIT_CATEGORY_SUCCESS,
  EDIT_CATEGORY_ERROR,
} = CategoryItemReducer.actions;

export const EditCategoryEpic: Epic<any, any, any> = (action$, state$) => {
  const editCategoryMutation = (categoryId: string, name: string) => {
    return `mutation {
      category {
        renameCategoryTest(categoryId: "${categoryId}", name: "${name}")
      }
    }`;
  };

  return action$.pipe(
    ofType(EDIT_CATEGORY),
    mergeMap((action) => {
      const { categoryId, name } = action.payload;
      return from(
        fetch(GraphQlEndpoint, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: editCategoryMutation(categoryId, name),
          }),
        })
      ).pipe(
        mergeMap((response) =>
          from(response.json()).pipe(
            mergeMap((data: any) => {
         
              if (data.errors) {
                store.dispatch(SHOW_ERROR_MESSAGE(data.errors[0].message));
                return [EDIT_CATEGORY_ERROR(data.errors[0].message)];
              } else {
                return [EDIT_CATEGORY_SUCCESS({ editSuccess: true })];
              }
            })
          )
        )
      );
    })
  );
};
