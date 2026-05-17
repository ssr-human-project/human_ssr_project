package com.ggori_salang.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PetResponse {

    private String petName;
    private String petType;
    private String breed;
    private String sizeType;
    private Double weight;
    private String description;
}