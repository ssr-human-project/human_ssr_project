package com.human.middle.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Comment {
    private Long id;
    private String content;
    private Long boardId;
    private Long memberId;
    private String        writer;
    private LocalDateTime createdAt;
}
