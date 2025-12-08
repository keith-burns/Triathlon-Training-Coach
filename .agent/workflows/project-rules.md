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