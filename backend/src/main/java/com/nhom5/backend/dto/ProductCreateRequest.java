package com.nhom5.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class ProductCreateRequest {
    @NotBlank(message = "Tiêu đề không được trống")
    @Size(max = 255, message = "Tiêu đề không được quá 255 ký tự")
    private String title;

    @NotNull(message = "Giá sản phẩm không được trống")
    @Min(value = 0, message = "Giá sản phẩm phải từ 0 trở lên")
    private Double price;

    private String description;

    @NotNull(message = "Danh mục không được trống")
    private Integer categoryId;

    @NotNull(message = "ID người bán không được trống")
    private Integer sellerId;

    @NotNull(message = "Số lượng không được trống")
    @Min(value = 1, message = "Số lượng sản phẩm phải từ 1 trở lên")
    private Integer quantity;

    @Size(max = 5, message = "Tải tối đa 5 hình ảnh")
    private List<String> images;
}
