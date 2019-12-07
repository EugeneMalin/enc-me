import { DefaultTheme, DarkTheme as DTheme } from 'react-native-paper'

export const LightTheme = {
    ...DefaultTheme,
    roundness: 8,
    dark: false,
    colors: {
        ...DefaultTheme.colors,
    }
}

export const DarkTheme = {
    ...DTheme,
    roundness: 5,
    dark: true,
    colors: {
        ...DTheme.colors,
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