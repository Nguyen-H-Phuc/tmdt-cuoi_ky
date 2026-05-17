package com.nhom5.backend.dto;

import java.time.LocalDate;

public interface DailyRevenue {
    LocalDate getDate();
    Double getRevenue();
}