---
name: flutter-testing
description: "Comprehensive Flutter & Dart test suite strategy: Unit testing domain logic, Widget testing with pumpWidget/finders, Golden UI visual regression testing, integration testing, and mocking dependencies with mocktail."
metadata:
  origin: "Adapted from ECC & Flutter Testing Best Practices"
  language: dart
  framework: flutter
---

# Flutter & Dart Comprehensive Testing Strategy

Production patterns and execution guidelines for unit, widget, golden, and integration testing in Flutter.

---

## 1. Test Pyramid & Execution Matrix

| Test Layer       | Target Scope                                | Framework / Tools              | Speed       |
| :--------------- | :------------------------------------------ | :----------------------------- | :---------- |
| **Unit Tests**   | Domain logic, usecases, repository mapping  | `test`, `mocktail`             | Fast (<5ms) |
| **Widget Tests** | UI components, interaction, state rendering | `flutter_test`, `WidgetTester` | Fast (<1s)  |
| **Golden Tests** | Pixel-accurate UI regression prevention     | `flutter_test` (matchesGolden) | Medium      |
| **Integration**  | End-to-end device/simulator workflows       | `integration_test`, `patrol`   | Slower      |

---

## 2. Unit Testing with Mocktail

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

// Abstract interface to mock
abstract class UserRepository {
  Future<User> getUser(String id);
}

class MockUserRepository extends Mock implements UserRepository {}

void main() {
  late MockUserRepository mockRepository;
  late GetUserUseCase useCase;

  setUp(() {
    mockRepository = MockUserRepository();
    useCase = GetUserUseCase(repository: mockRepository);
  });

  group('GetUserUseCase', () {
    const tUser = User(id: '123', name: 'Alice');

    test('should return User when repository call succeeds', () async {
      // Arrange
      when(() => mockRepository.getUser('123'))
          .thenAnswer((_) async => tUser);

      // Act
      final result = await useCase.execute('123');

      // Assert
      expect(result, equals(tUser));
      verify(() => mockRepository.getUser('123')).called(1);
    });

    test('should throw domain failure when repository fails', () async {
      // Arrange
      when(() => mockRepository.getUser('123'))
          .thenThrow(const ServerException('500 Internal Error'));

      // Act & Assert
      expect(() => useCase.execute('123'), throwsA(isA<ServerFailure>()));
    });
  });
}
```

---

## 3. Widget Testing with WidgetTester

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('CounterButton increments count when tapped', (WidgetTester tester) async {
    // 1. Pump Widget
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: CounterButton(),
        ),
      ),
    );

    // 2. Initial assertion
    expect(find.text('Count: 0'), findsOneWidget);
    expect(find.text('Count: 1'), findsNothing);

    // 3. Interact
    await tester.tap(find.byType(ElevatedButton));
    await tester.pump(); // Trigger frame rebuild

    // 4. Post-interaction assertion
    expect(find.text('Count: 0'), findsNothing);
    expect(find.text('Count: 1'), findsOneWidget);
  });
}
```

---

## 4. Golden UI Visual Testing

Golden tests capture rendered widget snapshots and detect inadvertent pixel shifts:

```dart
testWidgets('UserProfileCard golden visual regression test', (tester) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: ThemeData.light(),
      home: const Scaffold(
        body: Center(
          child: UserProfileCard(
            user: User(id: '1', name: 'John Doe', avatarUrl: ''),
          ),
        ),
      ),
    ),
  );

  // Compare against recorded golden image
  await expectLater(
    find.byType(UserProfileCard),
    matchesGoldenFile('goldens/user_profile_card_light.png'),
  );
});
```

---

## 5. Command Execution Reference

```bash
# Run all unit and widget tests:
flutter test

# Run tests with code coverage output:
flutter test --coverage

# Update golden file baselines:
flutter test --update-goldens
```
