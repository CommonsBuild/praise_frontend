import React from "react";
import { atom, selectorFamily, useRecoilState } from "recoil";
import { ApiAuthGetQuery, isApiResponseOk, useAuthApiQuery } from "./api";
import { Source } from "./source";
import { UserAccount } from "./users";

export interface QuantifiedPraise {
  id: number;
}

export interface Praise {
  id: number;
  createdAt: string;
  updatedAt: string;
  periodId?: number;
  reason: string;
  quantifiedPraises?: QuantifiedPraise[];
  giver: UserAccount;
  recipient: UserAccount;
  source: Source;
}

// The request Id is used to force refresh of AllPraisesQuery
// AllPraisesQuery subscribes to the value. Increase to trigger
// refresh.
const PraisesRequestId = atom({
  key: "PraisesRequestId",
  default: 0,
});

// A local only copy of all praises. Used to facilitate CRUD
// without having to make full roundtrips to the server
export const AllPraises = atom<Praise[] | undefined>({
  key: "AllPraises",
  default: undefined,
});

interface AllPraisesQueryParameters {
  praiseId?: number;
  periodId?: number;
  page?: number;
  size?: number;
  sort?: string[];
}

export const AllPraisesQuery = selectorFamily({
  key: "AllPraisesQuery",
  get:
    (params: any) =>
    async ({ get }) => {
      get(PraisesRequestId);
      let qs = Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&");
      const praises = get(
        ApiAuthGetQuery({ endPoint: `/api/praise/all${qs ? `?${qs}` : null}` })
      );
      return praises;
    },
});

export interface AllPraisesQueryPaginationInterface {
  latestFetchPageNumber: number;
  currentPageNumber: number;
  totalPages: number;
}
export const AllPraisesQueryPagination =
  atom<AllPraisesQueryPaginationInterface>({
    key: "AllPraisesQueryPagination",
    default: {
      latestFetchPageNumber: 0,
      currentPageNumber: 0,
      totalPages: 0,
    },
  });

export const useAllPraisesQuery = (queryParams: AllPraisesQueryParameters) => {
  const allPraisesQueryResponse = useAuthApiQuery(AllPraisesQuery(queryParams));
  const [allPraises, setAllPraises] = useRecoilState(AllPraises);
  const [praisePagination, setPraisePagination] = useRecoilState(
    AllPraisesQueryPagination
  );

  React.useEffect(() => {
    const data = allPraisesQueryResponse.data as any;
    if (
      (typeof allPraises === "undefined" ||
        data.pageable?.pageNumber > praisePagination.latestFetchPageNumber) &&
      isApiResponseOk(allPraisesQueryResponse)
    ) {
      if (
        data.content &&
        Array.isArray(data.content) &&
        data.content.length > 0
      ) {
        setPraisePagination({
          ...praisePagination,
          latestFetchPageNumber: data.pageable?.pageNumber,
          totalPages: data.totalPages,
        });
        setAllPraises(
          allPraises ? allPraises.concat(data.content) : data.content
        );
      }
    }
  }, [
    allPraisesQueryResponse,
    allPraises,
    praisePagination,
    setPraisePagination,
    setAllPraises,
  ]);

  return allPraisesQueryResponse;
};
