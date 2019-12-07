import { DefaultTheme, DarkTheme as DTheme } from 'react-native-paper'

export const LightTheme = {
    ...DefaultTheme,
    dark: false,
    colors: {
        ...DefaultTheme.colors,
        background: "#ffffff",
        btnColor: "#c3c3c3"

    }
}

export const DarkTheme = {
    ...DTheme,
    dark: true,
    colors: {
        ...DTheme.colors,
        background: "#000000",
        btnColor: "#303030"

    }
}

const CHANGE_THEME = "changedTheme"

export function changedTheme(theme) {
    return {
        type: CHANGE_THEME,
        theme: theme
    }
}

function reducer(state = LightTheme, action) {
    switch (action.type) {
        case CHANGE_THEME:
            switch (action.theme) {
                case LightTheme:
                    return DarkTheme
                case DarkTheme:
                    return LightTheme
                default:
                    return LightTheme
            }
        default:
            return state
    }
}

export default reducer;