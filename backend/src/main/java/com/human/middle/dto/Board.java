package com.human.middle.dto;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Board {
    private Long          id;
    private String        title;
    private String        content;
    private Long          memberId;
    private String        writer;
    private int           viewCount;
    private LocalDateTime createdAt;
}