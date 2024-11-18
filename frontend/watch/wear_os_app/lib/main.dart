import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_health_connect/flutter_health_connect.dart';
import 'package:http/http.dart' as http;
import 'package:wear/wear.dart';
import 'dart:convert';

Future<void> main() async {
  await dotenv.load();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        brightness: Brightness.dark,
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.compact,
      ),
      home: const HealthDataScreen(),
    );
  }
}

class HealthDataScreen extends StatefulWidget {
  const HealthDataScreen({super.key});

  @override
  State<HealthDataScreen> createState() => _HealthDataScreenState();
}

class _HealthDataScreenState extends State<HealthDataScreen> {
  final List<HealthConnectDataType> types = [
    HealthConnectDataType.Steps,
    HealthConnectDataType.HeartRate,
    HealthConnectDataType.SleepSession,
    HealthConnectDataType.OxygenSaturation,
    HealthConnectDataType.RespiratoryRate,
  ];
  
  bool isHealthConnectAvailable = false;
  String statusMessage = 'Initializing...';

  @override
  void initState() {
    super.initState();
    _initializeHealthConnect();
  }

  Future<void> _initializeHealthConnect() async {
    try {
      final supported = await HealthConnectFactory.isApiSupported();
      if (!supported) {
        setState(() => statusMessage = "Health Connect API is not supported on this device.");
        return;
      }

      final available = await HealthConnectFactory.isAvailable();
      if (!available) {
        setState(() => statusMessage = "Health Connect is not installed. Please install it.");
        await HealthConnectFactory.installHealthConnect();
        return;
      }

      final permissionsGranted = await HealthConnectFactory.hasPermissions(types, readOnly: false);
      if (!permissionsGranted) {
        final result = await HealthConnectFactory.requestPermissions(types, readOnly: false);
        if (!result) {
          setState(() => statusMessage = "Permissions are required to access health data.");
          return;
        }
      }

      setState(() {
        isHealthConnectAvailable = true;
        statusMessage = "Health Connect initialized successfully!";
      });
    } catch (e) {
      setState(() => statusMessage = "Error initializing Health Connect: $e");
    }
  }

  Future<void> _fetchAndSendHealthData() async {
    if (!isHealthConnectAvailable) {
      setState(() => statusMessage = "Health Connect is not available.");
      return;
    }

    setState(() => statusMessage = "Fetching health data...");
    final Map<String, dynamic> healthData = {};
    final startTime = DateTime.now().subtract(const Duration(days: 7));
    final endTime = DateTime.now();

    try {
      for (var type in types) {
        final records = await HealthConnectFactory.getRecord(
          type: type,
          startTime: startTime,
          endTime: endTime,
        );
        healthData[type.toString()] = records;
      }

      setState(() => statusMessage = "Health data fetched. Sending to backend...");
      await _sendDataToBackend(healthData);

      setState(() => statusMessage = "Data sent to backend successfully!");
    } catch (e) {
      setState(() => statusMessage = "Error fetching or sending data: $e");
    }
  }

  Future<void> _sendDataToBackend(Map<String, dynamic> healthData) async {
    final backendUrl = dotenv.env['BACKEND_URL'] ?? '';
    final apiToken = dotenv.env['API_TOKEN'] ?? '';
    
    if (backendUrl.isEmpty || apiToken.isEmpty) {
      throw Exception('Backend URL or API Token not configured');
    }

    try {
      final response = await http.post(
        Uri.parse(backendUrl),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $apiToken'
        },
        body: json.encode(healthData),
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to send data: ${response.statusCode}');
      }

      print("Backend response: ${response.body}");
    } catch (e) {
      print("Error sending data to backend: $e");
      throw e;
    }
  }

  @override
  Widget build(BuildContext context) {
    return WatchShape(
      builder: (context, shape, child) {
        final isRound = shape == WearShape.round;
        
        return Scaffold(
          backgroundColor: Colors.black,
          body: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            child: Padding(
              padding: EdgeInsets.all(isRound ? 20.0 : 16.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    statusMessage,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 14,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _fetchAndSendHealthData,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    child: const Text(
                      'Sync Data',
                      style: TextStyle(fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}