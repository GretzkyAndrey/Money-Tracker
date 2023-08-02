import { Epic, combineEpics, ofType } from "redux-observable";
import { from, mergeMap } from "rxjs";
import { request } from "../../api/core";
import { Stats } from "../../types/Stats";
import {
  FETCH_STATS,
  FETCH_STATS_SUCCESS,
  FETCH_STATS_ERROR,
} from "./Stats.slice";
import { GetStats } from "../../api/queries/Stats";
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
export const GetStatsEpics: Epic<any, any, any> = (action$, state$) => {
  return action$.pipe(
    ofType(FETCH_STATS),
    mergeMap(() =>
      from(request(GetStats)).pipe(
        mergeMap((data: any) => {
          if (data.errors) {
            return [FETCH_STATS_ERROR(data.errors[0].message)];
          } else {
            const stats = data.data.statistics.getStatistics as Stats[];
            const statsWithColor = stats.map((stat) => ({
              ...stat,
              color: getRandomColor(),
            }));
            return [
              FETCH_STATS_SUCCESS({
                stats: statsWithColor,
              }),
            ];
          }
        })
      )
    )
  );
};


export const StatsEpics = combineEpics(
  GetStatsEpics
)