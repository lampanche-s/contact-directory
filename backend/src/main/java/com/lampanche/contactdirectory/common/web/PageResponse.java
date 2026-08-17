package com.lampanche.contactdirectory.common.web;

import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

public class PageResponse<T> {

    private final List<T> items;
    private final int page;
    private final int pageSize;
    private final long totalItems;
    private final int totalPages;
    private final boolean hasPrevious;
    private final boolean hasNext;

    public PageResponse(
            List<T> items,
            int page,
            int pageSize,
            long totalItems,
            int totalPages,
            boolean hasPrevious,
            boolean hasNext
    ) {
        this.items = items;
        this.page = page;
        this.pageSize = pageSize;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
        this.hasPrevious = hasPrevious;
        this.hasNext = hasNext;
    }

    public static <E, R> PageResponse<R> fromPage(Page<E> page, Function<E, R> mapper) {
        List<R> items = page.getContent()
                .stream()
                .map(mapper)
                .toList();

        return new PageResponse<>(
                items,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasPrevious(),
                page.hasNext()
        );
    }

    public List<T> getItems() {
        return items;
    }

    public int getPage() {
        return page;
    }

    public int getPageSize() {
        return pageSize;
    }

    public long getTotalItems() {
        return totalItems;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public boolean isHasPrevious() {
        return hasPrevious;
    }

    public boolean isHasNext() {
        return hasNext;
    }
}
