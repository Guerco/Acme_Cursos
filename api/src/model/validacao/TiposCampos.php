<?php

enum TiposCampos: string {
    case INT = 'int';
    case FLOAT = 'float';
    case STRING = 'string';
    case BOOL = 'bool';
    case ARRAY = 'array';
    case ENUM = 'enum';
    case ENUM_ARRAY = 'enum_array';
}