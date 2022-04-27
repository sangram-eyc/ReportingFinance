export const ADD_TEAM_REGEX_PATTERN = {
    TEAM_NAME : '^[a-zA-Z0-9 \-\]+$'
}

export const ADD_STATIC_DATA_REGEX_PATTERN = {
    DISPLAY_NAME :'^[A-Za-z0-9 \\-\\_\\:\\/\\(\\)]*$',
    FILER_TYPE :'^[A-Za-z0-9 \\-\\_\\:\\/\\,\\.]*$'
}

export const ADD_USER_REGEX = {
    FIRST_NAME : '^[a-zA-Z \-\]+$',
    LAST_NAME : '^[a-zA-Z \-\]+$',
    EMAIL : '^(?!.*?[.]{2})[a-zA-Z0-9]+[a-zA-Z0-9.]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[a-zA-Z.]+\\.[a-zA-Z]{2,6}'
}