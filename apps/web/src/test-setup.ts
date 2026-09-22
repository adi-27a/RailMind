import '@testing-library/jest-dom/vitest';
if (!URL.createObjectURL) URL.createObjectURL = () => 'blob:railmind-test';
if (!URL.revokeObjectURL) URL.revokeObjectURL = () => undefined;
