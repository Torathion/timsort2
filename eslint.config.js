import shiny from 'eslint-config-shiny'

export default [
    ...await shiny({ configs: ['base', 'format', 'vitest'] }),
    {
        rules: {
            'unicorn/no-nested-ternary': 0,
            'no-redeclare': 0
        }
    }
]
