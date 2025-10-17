# 🧪 Testing & CI/CD Documentation

## 📊 Coverage Status
![Coverage](https://img.shields.io/codecov/c/github/yourusername/yourrepo)
![Build Status](https://img.shields.io/github/workflow/status/yourusername/yourrepo/CI)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)

## 🎯 Testing Strategy

### Coverage Goals
- **Overall**: 80%+ coverage
- **Branches**: 80%+ coverage  
- **Functions**: 80%+ coverage
- **Lines**: 80%+ coverage

### Test Types
1. **Unit Tests**: Component & utility testing
2. **Integration Tests**: Feature workflows
3. **E2E Tests**: Critical user paths
4. **Performance Tests**: Lighthouse CI

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run CI tests
npm run test:ci
```

## 📁 Test Structure

```
src/
├── components/
│   └── __tests__/        # Component tests
├── hooks/
│   └── __tests__/        # Hook tests
├── lib/
│   └── __tests__/        # Utility tests
├── contexts/
│   └── __tests__/        # Context tests
└── test/
    └── setup.ts          # Test configuration
```

## ✅ Testing Checklist

### Components
- [ ] Renders correctly
- [ ] Handles user interactions
- [ ] Validates props
- [ ] Manages state properly
- [ ] Accessibility compliance

### Hooks
- [ ] Returns expected values
- [ ] Updates on dependencies
- [ ] Handles edge cases
- [ ] Cleanup on unmount

### API/Services
- [ ] Successful responses
- [ ] Error handling
- [ ] Loading states
- [ ] Retry logic
- [ ] Rate limiting

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

#### 1. CI Pipeline (`ci.yml`)
Runs on every push/PR:
- ✅ Linting
- ✅ Type checking
- ✅ Unit tests
- ✅ Coverage reporting
- ✅ Build verification
- ✅ Lighthouse performance

#### 2. Deploy Pipeline (`deploy.yml`)
Runs on main branch:
- 🚀 Build production
- 🚀 Deploy to Vercel
- 🚀 Deploy Edge Functions
- 🚀 Run migrations
- 🚀 Send notifications

## 📈 Performance Benchmarks

### Lighthouse Scores (Required)
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 95+
- **PWA**: 90+

### Core Web Vitals
- **FCP**: < 2.0s
- **LCP**: < 2.5s
- **CLS**: < 0.1
- **TBT**: < 300ms
- **TTI**: < 3.8s

## 🛠️ Testing Tools

### Framework & Libraries
- **Vitest**: Test runner
- **React Testing Library**: Component testing
- **MSW**: API mocking
- **Happy DOM**: DOM environment
- **Coverage**: V8 provider

### CI/CD Tools
- **GitHub Actions**: Automation
- **Codecov**: Coverage tracking
- **Lighthouse CI**: Performance
- **Vercel**: Deployment
- **Supabase CLI**: Edge functions

## 📝 Writing Tests

### Component Test Example
```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
});
```

### Hook Test Example
```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '@/hooks/useCounter';

describe('useCounter', () => {
  it('increments count', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });
});
```

## 🔍 Debugging Tests

```bash
# Run specific test file
npm test Button.test.tsx

# Run tests in watch mode
npm test -- --watch

# Debug with UI
npm run test:ui

# Run with verbose output
npm test -- --reporter=verbose
```

## 📊 Coverage Reports

After running `npm run test:coverage`:
- HTML report: `coverage/index.html`
- JSON report: `coverage/coverage-final.json`
- LCOV report: `coverage/lcov.info`

## 🚨 Common Issues & Solutions

### Issue: Tests failing in CI but passing locally
**Solution**: Ensure environment variables match, clear cache

### Issue: Coverage below threshold
**Solution**: Add tests for uncovered lines, check coverage report

### Issue: Slow test execution
**Solution**: Use test.concurrent, optimize setup/teardown

## 🎯 Best Practices

1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Keep tests isolated and independent**
4. **Mock external dependencies**
5. **Test edge cases and errors**
6. **Maintain test data fixtures**
7. **Run tests before committing**

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [GitHub Actions](https://docs.github.com/actions)
- [Codecov](https://docs.codecov.com/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)