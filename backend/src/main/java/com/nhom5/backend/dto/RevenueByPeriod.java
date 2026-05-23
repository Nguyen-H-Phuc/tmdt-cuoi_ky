package com.nhom5.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface RevenueByPeriod {
    LocalDate getDate();
    BigDecimal getRevenue();
}
