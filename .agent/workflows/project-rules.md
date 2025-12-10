---
description: Global development rules and quality standards for the Triathlon Training Coach project
---

# Project Rules

Execute all work as an expert solution architect, full-stack developer, QA engineer, and technical reviewer.

## 1. Requirement Validation
- Ensure every requirement is met before finalizing
- Identify missing features or unclear areas for user review
- Do not deliver until the solution fully satisfies requirements

## 2. Technical Accuracy
- Check code for syntax errors, incorrect imports, broken logic
- Verify undefined variables, missing returns, incorrect types
- Ensure proper React hook usage and modern conventions
- Code must run without errors

## 3. Architecture & Best Practices
- Write clean, readable, modular, and scalable code
- Avoid duplication, unclear variable names, or hacky solutions
- Follow best practices for component structure and state management
- Maintain separation of concerns

## 4. Output Completeness
- Include all necessary components, interfaces, data models, handlers
- Provide clear explanations or usage instructions when needed

## 5. Safety & Security
- No harmful or insecure instructions
- Never include secrets, tokens, or unsafe patterns
- Sanitize user inputs, validate data

## 6. Integration
- Ensure solution integrates with existing app architecture
- Align props, state, structure, and naming conventions with project patterns

## 7. QA Review
- Perform internal QA before delivering
- Document issues found and corrected

## 8. Testing Strategy
- Write unit tests for utility functions
- Write integration tests for critical user flows
- Aim for meaningful coverage

## 9. Error Handling
- Implement error boundaries for React components
- Provide user-friendly error messages
- Never fail silently; log errors appropriately

## 10. Performance
- Avoid unnecessary re-renders
- Memorize expensive computations
- Lazy-load routes and components
- Optimize bundle size

## 11. Accessibility (a11y)
- Ensure WCAG 2.1 AA compliance
- Use proper ARIA labels and semantic HTML
- Support keyboard navigation
- Maintain sufficient color contrast

## 12. Documentation
- Document complex logic and non-obvious decisions
- Use JSDoc for public APIs and utilities

## 13. Consistent Patterns
- Follow established patterns for data fetching, forms, and state
- Don't mix paradigms within the same feature

## 14. Git Hygiene
- Use meaningful, atomic commits
- Keep main branch deployable at all times

## 15. Local Changes Only
- Do not make any changes outside of the Triathlon Training Coach project's folder

---

## 16. Feature Completion Workflow

Every time a feature from the backlog is completed, perform these steps:

### 16.1 Update Documentation
- **BACKLOG.md**: Mark status as "Done", note completion date
- **development.md**: Update dependency graph if a blocker is cleared; note what's now unblocked
- **CONVERSATION_SUMMARY.md**: Document what was built, key decisions made, lessons learned

### 16.2 Regression Testing
- Run the full test suite before marking a feature complete
- Ensure no existing tests are broken by new changes
- **Before B-029 is complete**: Manual verification of critical paths (plan generation, auth, workout display)
- **After B-029 is complete**: Run `npm test` and ensure all tests pass

### 16.3 Recommend New Tests
Before completing a feature, recommend specific tests to add:
- **Unit tests**: Pure logic functions (plan generation, calculations, utilities)
- **Integration tests**: Component interactions, data flow
- **E2E tests**: Critical user flows (if applicable)

Minimum coverage target: All new public functions must have unit tests.

---

## 17. Build Verification
- Run `npm run build` before marking any feature complete
- TypeScript errors in CI break deployments
- Build must complete without errors or warnings

---

## 18. Mobile Testing
- Verify all UI changes on mobile viewport (375px width minimum)
- B-019 (PWA) is a priority; mobile experience is critical
- Test touch interactions and scrolling behavior

---

## 19. Conventional Commits
Use meaningful commit messages following the conventional commit format:
- `feat(B-XXX): description` - New feature
- `fix(B-XXX): description` - Bug fix
- `refactor: description` - Code refactoring
- `test: description` - Adding tests
- `docs: description` - Documentation updates

Example: `feat(B-007): add workout day preferences`

---

## 20. Console Cleanliness
- Check browser console for errors and warnings before completion
- Clean console = production-ready
- Address React warnings (missing keys, deprecated lifecycle methods, etc.)
- Remove console.log statements used for debugging