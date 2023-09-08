import 'jest-preset-angular/setup-jest';

import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
