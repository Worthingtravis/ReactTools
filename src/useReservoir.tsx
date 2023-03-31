import useSWRInfinite from 'swr/infinite';
import { setParams } from '@/utils';
import { useCallback, useEffect, useMemo } from 'react';
import { PublicConfiguration } from 'swr/dist/types';

interface UseInfiniteFetchParams {
    baseUrl: string;
    options: Record<string, any>;
    swrOptions?: Partial<PublicConfiguration>;
    reverseData?: boolean;
}

interface UseInfiniteFetchInViewProps extends UseInfiniteFetchParams {
    isInView: boolean;
}

// this hook is used to fetch data from the "reservoir" api.
// This could be used to fetch any data from the api assuming
// continuation is the key used to paginate the data, consider adding a param to allow for custom pagination keys if needed.

const apikey: string = process.env.NEXT_PUBLIC_RESERVOIR_API_KEY || '';

const getKeyToFlatten = (data) => {
    if (!data?.length) {
        return null;
    }
    return Object.keys(data?.[0])?.find((k) => k !== 'continuation') ?? null;
};

const useFlattenedData = (data, keyToFlatten) =>
    useMemo(
        () => (keyToFlatten !== null && keyToFlatten !== undefined ? data?.flatMap((page) => page?.[keyToFlatten]) ?? [] : data ?? []),
        [data, keyToFlatten]
    );

const useIsFetchingPage = (flattenedData, size): boolean =>
    useMemo(() => size > 0 && flattenedData && typeof flattenedData[size - 1] === 'undefined', [flattenedData, size]);

const useFetchNextPage = (data, error, setSize, size, keyToFlatten): (() => Promise<void>) =>
    useCallback(async () => {
        if (!data && !error) return;
        if (size > 0 && typeof data?.[size - 1] === 'undefined') return;

        if (!keyToFlatten || (data?.[size - 1]?.[keyToFlatten]?.length || 0) <= 0) return;
        await setSize(size + 1);
    }, [data, error, setSize, size, keyToFlatten]);
const useReversedData = (data, shouldReverse) => useMemo(() => (shouldReverse ? data.slice().reverse() : data), [data, shouldReverse]);

const getUrlWithParams = (url, options, pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.continuation) return null;
    const urlObj = new URL(url);
    const query = { ...options };

    if (pageIndex > 0 && previousPageData?.continuation) {
        query.continuation = previousPageData.continuation;
    }
    setParams(urlObj, query);
    return urlObj.href;
};

interface UseInfiniteResponse {
    isValidating: boolean;
    data: any;
    fetchNextPage: () => Promise<void>;
    isFetchingInitialData: boolean;
    isFetchingPage: boolean;
    setSize: (size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
    error: any;
}

// primary hook
export const useInfiniteFetch = ({ baseUrl, options, swrOptions, reverseData }: UseInfiniteFetchParams): UseInfiniteResponse => {
    const { data, error, size, setSize, isValidating } = useSWRInfinite(
        useCallback((pageIndex, previousPageData) => getUrlWithParams(baseUrl, options, pageIndex, previousPageData), [baseUrl, options]),
        useCallback(async (url) => {
            const res = await fetch(url, {
                headers: [['x-api-key', apikey]],
            });
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        }, []),
        {
            refreshInterval: 0,
            refreshWhenHidden: false,
            revalidateFirstPage: false,
            suspense: true,
            revalidateOnFocus: false,
            ...swrOptions,
        }
    );

    const keyToFlatten = getKeyToFlatten(data);
    const flattenedData = useFlattenedData(data, keyToFlatten);
    const reversedData = useReversedData(flattenedData, reverseData);
    const isFetchingPage = useIsFetchingPage(flattenedData, size);
    const fetchNextPage = useFetchNextPage(data, error, setSize, size, keyToFlatten);

    return {
        isValidating,
        data: reversedData,
        fetchNextPage,
        isFetchingInitialData: !flattenedData && !error,
        isFetchingPage,
        setSize,
        error,
    } as UseInfiniteResponse;
};

export const useInfiniteFetchInView = ({
    isInView,
    baseUrl,
    options,
    swrOptions = undefined,
    reverseData = false,
}: UseInfiniteFetchInViewProps): UseInfiniteResponse => {
    const { data, fetchNextPage, ...rest } = useInfiniteFetch({
        baseUrl,
        options,
        swrOptions,
        reverseData,
    });

    useEffect(() => {
        if (isInView) fetchNextPage();
    }, [isInView]);

    return { data, fetchNextPage, ...rest };
};
