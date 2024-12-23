import React from 'react';
import type { TFunction } from '../hooks/useTranslations';

export const TranslationContext = React.createContext<TFunction | null>(null);
