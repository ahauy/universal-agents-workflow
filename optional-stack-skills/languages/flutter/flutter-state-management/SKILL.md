---
name: flutter-state-management
description: "Flutter production state management patterns: Riverpod (Notifier, AsyncNotifier, family, autoDispose) and BLoC/Cubit (sealed events/states, BlocBuilder, BlocListener, event debouncing) with strict immutability and lifecycle disposal."
metadata:
  origin: "Adapted from ECC & Flutter Riverpod/BLoC Architecture"
  language: dart
  framework: flutter
---

# Flutter Production State Management

Architectural guidelines and reference patterns for managing application state in Flutter using **Riverpod** and **BLoC / Cubit**.

---

## 1. Core Principles: Immutability & Lifecycle Safety

1. **Strict Immutability**: State objects must never be mutated in place. Always emit a new instance via `.copyWith(...)` or return new sealed class instances.
2. **Deterministic Lifecycle**: Every listener, controller, or stream must have an explicit unmount/disposal strategy (`autoDispose` in Riverpod, `close()` in BLoC, or `dispose()` in `StatefulWidget`).
3. **No Business Logic in Views**: UI widgets only read state and dispatch user intents. All asynchronous calls, data transformations, and validations reside in the state manager.

---

## 2. Pattern A: Modern Riverpod (Notifier / AsyncNotifier)

Riverpod provides compile-safe, testable dependency injection and state management without relying on `BuildContext`.

### AsyncNotifier Implementation

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

// 1. Immutable State
class UserState {
  final List<User> users;
  final bool isSubmitting;
  final String? error;

  const UserState({
    this.users = const [],
    this.isSubmitting = false,
    this.error,
  });

  UserState copyWith({
    List<User>? users,
    bool? isSubmitting,
    String? error,
  }) {
    return UserState(
      users: users ?? this.users,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      error: error,
    );
  }
}

// 2. Notifier
final userListProvider = AsyncNotifierProvider.autoDispose<UserListNotifier, UserState>(() {
  return UserListNotifier();
});

class UserListNotifier extends AutoDisposeAsyncNotifier<UserState> {
  late final UserRepository _repository = ref.watch(userRepositoryProvider);

  @override
  Future<UserState> build() async {
    final users = await _repository.fetchUsers();
    return UserState(users: users);
  }

  Future<void> addUser(String name) async {
    final currentState = state.valueOrNull ?? const UserState();
    state = AsyncValue.data(currentState.copyWith(isSubmitting: true, error: null));

    try {
      final newUser = await _repository.createUser(name);
      state = AsyncValue.data(currentState.copyWith(
        users: [...currentState.users, newUser],
        isSubmitting: false,
      ));
    } catch (e) {
      state = AsyncValue.data(currentState.copyWith(
        isSubmitting: false,
        error: e.toString(),
      ));
    }
  }
}
```

### UI Consumption

```dart
class UserListPage extends ConsumerWidget {
  const UserListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncState = ref.watch(userListProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Users')),
      body: asyncState.when(
        data: (state) => ListView.builder(
          itemCount: state.users.length,
          itemBuilder: (context, index) => ListTile(
            title: Text(state.users[index].name),
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator.adaptive()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => ref.read(userListProvider.notifier).addUser('New User'),
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

---

## 3. Pattern B: BLoC / Cubit (Events, States & Transformers)

BLoC enforces a strict event-driven architecture using Dart 3 sealed classes.

### Sealed Events & States

```dart
// Events
sealed class AuthEvent {
  const AuthEvent();
}

final class LoginRequested extends AuthEvent {
  final String email;
  final String password;
  const LoginRequested({required this.email, required this.password});
}

final class LogoutRequested extends AuthEvent {
  const LogoutRequested();
}

// States
sealed class AuthState {
  const AuthState();
}

final class AuthInitial extends AuthState {
  const AuthInitial();
}

final class AuthLoading extends AuthState {
  const AuthLoading();
}

final class Authenticated extends AuthState {
  final User user;
  const Authenticated(this.user);
}

final class AuthUnauthenticated extends AuthState {
  final String? message;
  const AuthUnauthenticated({this.message});
}
```

### BLoC Handler

```dart
import 'package:flutter_bloc/flutter_bloc.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository _authRepository;

  AuthBloc({required AuthRepository authRepository})
      : _authRepository = authRepository,
        super(const AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
    on<LogoutRequested>(_onLogoutRequested);
  }

  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());
    try {
      final user = await _authRepository.login(event.email, event.password);
      emit(Authenticated(user));
    } catch (e) {
      emit(AuthUnauthenticated(message: e.toString()));
    }
  }

  Future<void> _onLogoutRequested(
    LogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    await _authRepository.logout();
    emit(const AuthUnauthenticated());
  }
}
```

### Selective Rebuilding (`BlocBuilder` vs `BlocListener`)

- Use `BlocListener` for one-shot UI side-effects (showing SnackBars, navigation, dialogs).
- Use `BlocBuilder` with `buildWhen` to optimize widget re-renders.
- Use `BlocConsumer` when both rebuilding and side-effects are needed simultaneously.
