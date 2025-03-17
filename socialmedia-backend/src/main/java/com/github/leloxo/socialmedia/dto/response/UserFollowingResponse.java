package com.github.leloxo.socialmedia.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserFollowingResponse {
    private Long userId;
    private List<UserSummaryResponse> following;
    private int count;
}
