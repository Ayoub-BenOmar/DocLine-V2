package org.ayoub.docline;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.ayoub.docline.model.dto.UnavailabilityDto;
import org.ayoub.docline.model.entity.Unavailability;
import org.ayoub.docline.service.DoctorService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class DoctorUnavailabilityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DoctorService doctorService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "doctor@docline.com", authorities = {"DOCTOR"})
    public void testAddUnavailability() throws Exception {
        UnavailabilityDto dto = UnavailabilityDto.builder()
                .startDate(LocalDate.of(2026, 2, 20))
                .endDate(LocalDate.of(2026, 2, 21))
                .reason("Conference")
                .build();

        Unavailability unavailability = Unavailability.builder()
                .id(1)
                .startDate(dto.getStartDate())
                .reason(dto.getReason())
                .build();

        when(doctorService.addUnavailability(any(UnavailabilityDto.class), anyString()))
                .thenReturn(unavailability);

        mockMvc.perform(post("/api/doctor/unavailability")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reason").value("Conference"));
    }

    @Test
    @WithMockUser(username = "doctor@docline.com", authorities = {"DOCTOR"})
    public void testGetMyUnavailabilities() throws Exception {
        Unavailability unavailability = Unavailability.builder()
                .id(1)
                .startDate(LocalDate.of(2026, 2, 20))
                .reason("Sick Leave")
                .build();

        when(doctorService.getMyUnavailabilities(anyString()))
                .thenReturn(List.of(unavailability));

        mockMvc.perform(get("/api/doctor/unavailability"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].reason").value("Sick Leave"));
    }
}
