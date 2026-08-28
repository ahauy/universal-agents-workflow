---
name: flutter-networking-storage
description: "Resilient Flutter networking and local storage architecture: Dio client with JWT interceptors, exponential backoff retry, structured exception mapping, and offline-first storage with Drift/SQLite, Hive, and flutter_secure_storage."
metadata:
  origin: "Adapted from ECC & Flutter Data Persistence Standards"
  language: dart
  framework: flutter
---

# Flutter Networking & Data Persistence Architecture

Production patterns for building resilient HTTP clients, token interceptors, and local offline-first persistence in Flutter.

---

## 1. Resilient Networking with Dio

### Client Setup & Interceptor Pipeline

```dart
import 'package:dio/dio.dart';

class ApiClient {
  late final Dio _dio;

  ApiClient({required String baseUrl, required SecureTokenStorage tokenStorage}) {
    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 15),
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      ),
    );

    _dio.interceptors.addAll([
      AuthInterceptor(tokenStorage: tokenStorage, dio: _dio),
      LogInterceptor(requestBody: true, responseBody: true),
    ]);
  }

  Dio get instance => _dio;
}
```

### Automatic Token Refresh Interceptor

```dart
class AuthInterceptor extends QueuedInterceptor {
  final SecureTokenStorage _tokenStorage;
  final Dio _dio;

  AuthInterceptor({required SecureTokenStorage tokenStorage, required Dio dio})
      : _tokenStorage = tokenStorage,
        _dio = dio;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await _tokenStorage.getAccessToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    return handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401) {
      // 1. Attempt token refresh
      final refreshed = await _refreshToken();
      if (refreshed != null) {
        // 2. Retry original request with new token
        final requestOptions = err.requestOptions;
        requestOptions.headers['Authorization'] = 'Bearer $refreshed';
        try {
          final response = await _dio.fetch(requestOptions);
          return handler.resolve(response);
        } catch (e) {
          return handler.reject(err);
        }
      }
    }
    return handler.next(err);
  }

  Future<String?> _refreshToken() async {
    // Implementation of token renewal logic
    return null;
  }
}
```

---

## 2. Secure & Offline-First Persistence

| Storage Option               | Best Use Case                                       | Package                         |
| :--------------------------- | :-------------------------------------------------- | :------------------------------ |
| **`flutter_secure_storage`** | Sensitive tokens, API keys, encryption secrets      | `flutter_secure_storage`        |
| **`Drift` (formerly Moor)**  | Structured relational data, complex queries, SQLite | `drift`, `sqlite3_flutter_libs` |
| **`Hive` / `Isar`**          | Fast NoSQL object store, document caching           | `isar` / `hive_ce`              |
| **`shared_preferences`**     | Lightweight key-value flags (e.g. `isDarkModeOn`)   | `shared_preferences`            |

### Secure Token Storage Wrapper

```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

abstract class SecureTokenStorage {
  Future<void> saveTokens({required String accessToken, required String refreshToken});
  Future<String?> getAccessToken();
  Future<void> clearTokens();
}

class SecureTokenStorageImpl implements SecureTokenStorage {
  final FlutterSecureStorage _storage;

  const SecureTokenStorageImpl({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage(
          aOptions: AndroidOptions(encryptedSharedPreferences: true),
          iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
        );

  @override
  Future<void> saveTokens({required String accessToken, required String refreshToken}) async {
    await _storage.write(key: 'access_token', value: accessToken);
    await _storage.write(key: 'refresh_token', value: refreshToken);
  }

  @override
  Future<String?> getAccessToken() => _storage.read(key: 'access_token');

  @override
  Future<void> clearTokens() async {
    await _storage.delete(key: 'access_token');
    await _storage.delete(key: 'refresh_token');
  }
}
```
