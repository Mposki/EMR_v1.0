# Praca Inżynierska

## Client

Aplikacja WEB napisana w technologii Angular.

## PatientsDatabase

Serwer napisany w technologii Spring Boot.

Zawiera funkcjonalności:
- autoryzacja i wysyłka maili autoryzacyjnych
- komunikacja z bazą danych (MySQL oraz PostgreSQL)

## Tesowanie

Przechodząc pod link https://portal-zarzadzajacy-pacjentami.herokuapp.com/ mamy możliwość przetestowania aplikacji.

Dane testowe:
- mail:
    login- test_user_pzp@outlook.com
    hasło- 6eRz;g"9;
- użytkownik
    login- test_user
    hasło- 6eRz;g"9

Logowanie, rejestracja, usuwanie konta oraz pacjentów wymaga podania kodu weryfikacyjnego na zarejestrowany adres email.

Portal w trakcie testów niefunkcjonalnych wykazał odporność na podawanie błędnych danych.
