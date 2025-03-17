package com.github.leloxo.socialmedia.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FollowStatusResponse {
    private boolean following;
    private Long userId;
    private Long targetUserId;
}
