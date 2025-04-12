import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform, Share
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";


export default function Invoice() {
  const allInvoices = [
    { id: "1", date: "Feb 10, 2025", amount: "$120.50", status: "Paid" },
    { id: "2", date: "Jan 25, 2025", amount: "$89.99", status: "Paid" },
    { id: "3", date: "Dec 15, 2024", amount: "$150.00", status: "Unpaid" },
    { id: "4", date: "Nov 20, 2024", amount: "$70.00", status: "Paid" },
    { id: "5", date: "Oct 5, 2024", amount: "$250.75", status: "Unpaid" },
    { id: "6", date: "Sep 10, 2024", amount: "$300.00", status: "Paid" },
    { id: "7", date: "Aug 15, 2024", amount: "$400.00", status: "Unpaid" },
    { id: "8", date: "Jul 30, 2024", amount: "$50.00", status: "Paid" },
  ];

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Search functionality state
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered invoices for search
  const filteredInvoices = allInvoices.filter((invoice) =>
    invoice.id.includes(searchQuery)
  );

  // Paginated invoices
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  // Mock download function
  const handleShare = async (id, invoiceData) => {
    try {
      // Create HTML content for the invoice
      const htmlContent = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              h1 {
                color: #333;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              table, th, td {
                border: 1px solid #ddd;
              }
              th, td {
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f4f4f4;
              }
            </style>
          </head>
          <body>
            <h1>Invoice</h1>
            <p><strong>Invoice ID:</strong> ${invoiceData.id}</p>
            <p><strong>Date:</strong> ${invoiceData.date}</p>
            <p><strong>Amount:</strong> ${invoiceData.amount}</p>
            <p><strong>Status:</strong> ${invoiceData.status}</p>
            <table>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
              <tr>
                <td>Product Purchase</td>
                <td>${invoiceData.amount}</td>
              </tr>
            </table>
          </body>
        </html>
      `;

      // Generate the PDF
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log("PDF generated at:", uri);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Success", `Invoice ${id} has been saved at: ${uri}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to download the invoice. Please try again.");
      console.error("Download Error:", error);
    }
  };

  const handleDownload = async (id, invoiceData) => {
    try {
      // 1. Generate HTML for the invoice
      const htmlContent = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              h1 {
                color: #333;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              table, th, td {
                border: 1px solid #ddd;
              }
              th, td {
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f4f4f4;
              }
            </style>
          </head>
          <body>
            <h1>Invoice</h1>
            <p><strong>Invoice ID:</strong> ${invoiceData.id}</p>
            <p><strong>Date:</strong> ${invoiceData.date}</p>
            <p><strong>Amount:</strong> ${invoiceData.amount}</p>
            <p><strong>Status:</strong> ${invoiceData.status}</p>
            <table>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
              <tr>
                <td>Product Purchase</td>
                <td>${invoiceData.amount}</td>
              </tr>
            </table>
          </body>
        </html>
      `;
  
      // 2. Generate the PDF
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log("PDF generated at:", uri);
  
      // 3. Define the file path for saving
      const fileUri = `${FileSystem.documentDirectory}Invoice_${invoiceData.id}.pdf`;
  
      // 4. Move the file to the app's document directory
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });
  
      // 5. Provide options for sharing or accessing the file
      if (Platform.OS === "android") {
        Alert.alert(
          "Download Successful",
          `Invoice ${id} has been saved.\n\nLocation: ${fileUri}`,
          [
            {
              text: "Share",
              onPress: () =>
                Share.share({
                  message: `Your invoice is saved here: ${fileUri}`,
                  url: fileUri,
                }),
            },
            { text: "OK" },
          ]
        );
      } else {
        Alert.alert(
          "Download Successful",
          `Invoice ${id} has been saved. You can access it in the app's directory.`,
          [{ text: "OK" }]
        );
      }
  
      console.log("File saved to:", fileUri);
    } catch (error) {
      Alert.alert("Error", "Failed to download the invoice. Please try again.");
      console.error("Download Error:", error);
    }
  };

  // Render individual invoice item
  const renderInvoiceItem = ({ item }) => (
    <View style={styles.invoiceCard}>
      <View>
        <Text style={styles.invoiceText}>Invoice ID: {item.id}</Text>
        <Text style={styles.invoiceText}>Date: {item.date}</Text>
        <Text style={styles.invoiceText}>Amount: {item.amount}</Text>
        <Text
          style={[
            styles.invoiceStatus,
            { color: item.status === "Paid" ? "green" : "red" },
          ]}
        >
          Status: {item.status}
        </Text>
      </View>
      <View style={{gap:4}}>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => handleDownload(item.id, item)}>
          <MaterialIcons name="file-download" size={24} color="#fff" />
          <Text style={styles.downloadText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => handleShare(item.id, item)}>
          <MaterialIcons name="share" size={24} color="#fff" />
          <Text style={styles.downloadText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Invoices</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Invoice ID"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {/* Invoice List */}
      <FlatList
        data={paginatedInvoices}
        keyExtractor={(item) => item.id}
        renderItem={renderInvoiceItem}
        contentContainerStyle={styles.list}
      />

      {/* Pagination Controls */}
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[
            styles.pageButton,
            { opacity: currentPage === 1 ? 0.5 : 1 },
          ]}
          disabled={currentPage === 1}
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.pageText}>
          Page {currentPage} of {totalPages}
        </Text>
        <TouchableOpacity
          style={[
            styles.pageButton,
            { opacity: currentPage === totalPages ? 0.5 : 1 },
          ]}
          disabled={currentPage === totalPages}
          onPress={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          <MaterialIcons name="arrow-forward" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  list: {
    paddingBottom: 20,
  },
  invoiceCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  invoiceText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  invoiceStatus: {
    fontSize: 16,
    fontWeight: "bold",
  },
  shareButton: {
    backgroundColor: "steelblue",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent:'center'
  }, 
  downloadButton: {
    backgroundColor: "#EB6A39",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  downloadText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  pageButton: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
