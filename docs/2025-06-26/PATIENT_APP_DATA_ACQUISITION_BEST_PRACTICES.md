# Data Acquisition Best Practices for the Patient-Facing App

This document outlines the recommended practices for the patient-facing application when acquiring data from the database. The primary focus is on ensuring data security, integrity, and optimal performance, especially given the sensitive nature of patient information.

## 1. Core Principles for Data Acquisition

When accessing database information, the patient-facing app must adhere to the following principles:

*   **Security First**: Patient data is highly sensitive. All data acquisition must prioritize security, ensuring only authorized users can access relevant information.
*   **Data Integrity**: Ensure that data retrieved is accurate, consistent, and complete.
*   **Performance Optimization**: Implement efficient data fetching strategies to provide a responsive user experience.
*   **Robust Error Handling**: Gracefully manage scenarios where data acquisition fails or encounters issues.
*   **Least Privilege**: Access only the data strictly necessary for the current operation.

## 2. Security Best Practices: Row Level Security (RLS)

Row Level Security (RLS) is paramount for patient data isolation. The application must rely on robust RLS policies enforced at the database level, rather than attempting to filter data solely on the client-side.

### 2.1. Enforce Patient Data Isolation

*   **Policy Definition**: For all patient-related tables (e.g., `patients`, `check_in`, `consultations`, `documents`, `email_logs`, `form_requests`, `message_store`, `order`, `pb_client_packages`, `pb_invoices`, `pb_sessions`, `pb_tasks`, `sms_logs`, `session`, `virtual_follow_ups`), RLS policies must ensure that a patient can **only** access their own data.
    *   **Example RLS Policy (for a patient-specific table)**:
        ```sql
        -- READ POLICY: Users can only read their own data
        CREATE POLICY "Users can view own data" ON [patient_table]
        FOR SELECT USING (
          patient_id = (SELECT id FROM patients WHERE user_id = auth.uid())
        );

        -- WRITE POLICY: Users can only modify their own data
        CREATE POLICY "Users can modify own data" ON [patient_table]
        FOR ALL USING (
          patient_id = (SELECT id FROM patients WHERE user_id = auth.uid())
        );
        ```
        (Referenced from [`docs/security/RLS_SECURITY_RECOMMENDATIONS.md`](docs/security/RLS_SECURITY_RECOMMENDATIONS.md):lines 28-37, 94-107)

*   **Avoid Overly Permissive Policies**: Never use `Policy definition: true` as it allows any authenticated user to read/write all data, violating HIPAA and data protection requirements. This is a critical vulnerability.
    (Referenced from [`docs/security/RLS_SECURITY_RECOMMENDATIONS.md`](docs/security/RLS_SECURITY_RECOMMENDATIONS.md):lines 9-19)

### 2.2. Role-Based Access Control (RBAC)

While the patient app primarily deals with patient-specific data, ensure that any shared data (e.g., `products`, `subscription_plans`, `services`) has RLS policies that allow authenticated users to view them, but restrict modification to administrative roles (e.g., `admin`, `provider`).

*   **Example RBAC Policy (for shared data)**:
    ```sql
    -- READ POLICY: All authenticated users can view available packages
    CREATE POLICY "Authenticated users can view packages" ON treatment_package
    FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);
    ```
    (Referenced from [`docs/security/RLS_SECURITY_RECOMMENDATIONS.md`](docs/security/RLS_SECURITY_RECOMMENDATIONS.md):lines 41-45)

## 3. Data Fetching and Performance

Efficient data acquisition is crucial for a smooth user experience.

### 3.1. Utilize an API Layer (React Query Hooks)

The application should interact with the database through a well-defined API layer, preferably using React Query hooks as demonstrated in the existing codebase. This abstracts database interactions, provides caching, and simplifies data management.

*   **Relevant Implementations**:
    *   `src/apis/appointments/hooks.js`
    *   `src/apis/checkIns/hooks.js`
    *   `src/apis/labResults/hooks.js`
    *   `src/apis/messages/hooks.js`
    *   `src/apis/orders/enhancedHooks.js`
    (These files are open in VSCode and represent the current approach to API interaction.)

### 3.2. Batch Fetching Related Data

Avoid N+1 query problems by batch fetching related data. Instead of making individual requests for each related item, fetch all primary data, then batch fetch all associated relationships in a minimal number of subsequent queries.

*   **Implementation Example (Conceptual)**:
    ```javascript
    // 1. Fetch primary data (e.g., all patient's orders)
    const { data: ordersData } = await supabase.from('order')...

    // 2. Extract IDs and batch fetch related items (e.g., products for all orders)
    const orderIds = ordersData.map(order => order.id);
    const { data: productsData } = await supabase
      .from('order_products') // Assuming a junction table
      .select('order_id, product_id')
      .in('order_id', orderIds);
    ```
    (Referenced from [`docs/api/SERVICE_PERFORMANCE_OPTIMIZATIONS.md`](docs/api/SERVICE_PERFORMANCE_OPTIMIZATIONS.md):lines 31-45)

### 3.3. Parallel Requests for Single Item Details

When fetching a single item and its related details, use `Promise.all` to execute multiple API requests concurrently. This significantly reduces the total load time.

*   **Implementation Example (Conceptual)**:
    ```javascript
    const [itemResponse, relatedData1Response, relatedData2Response] = await Promise.all([
      supabase.from('items').select('*').eq('id', itemId).single(),
      supabase.from('related_table_1').select('*').eq('item_id', itemId),
      supabase.from('related_table_2').select('*').eq('item_id', itemId)
    ]);
    ```
    (Referenced from [`docs/api/SERVICE_PERFORMANCE_OPTIMIZATIONS.md`](docs/api/SERVICE_PERFORMANCE_OPTIMIZATIONS.md):lines 50-58)

### 3.4. Query Caching with Stale Time

Implement client-side caching for frequently accessed data using a stale-while-revalidate strategy. This allows the UI to display cached data instantly while new data is fetched in the background.

*   **Recommendation**: Use a `staleTime` (e.g., 30 seconds) for queries where immediate real-time consistency isn't critical.
    (Referenced from [`docs/api/SERVICE_PERFORMANCE_OPTIMIZATIONS.md`](docs/api/SERVICE_PERFORMANCE_OPTIMIZATIONS.md):lines 66-74)

### 3.5. Empty Results Optimization

When a query is expected to return no results (e.g., a patient has no orders), immediately return an empty dataset to avoid unnecessary processing.
(Referenced from [`docs/api/SERVICE_PERFORMANCE_OPTIMIZATIONS.md`](docs/api/SERVICE_PERFORMANCE_OPTIMIZATIONS.md):lines 89-94)

## 4. Error Handling and Robustness

Implement comprehensive error handling to ensure the application remains stable even if data acquisition fails.

*   **Graceful Degradation**: If fetching related data fails, the primary data should still load, with related fields appearing as empty arrays or null.
*   **Specific Error Logging**: Log errors with sufficient detail to aid debugging.
*   **Try/Catch Blocks**: Wrap data fetching logic in try/catch blocks to prevent application crashes.
    (Referenced from [`docs/api/SERVICE_PERFORMANCE_OPTIMIZATIONS.md`](docs/api/SERVICE_PERFORMANCE_OPTIMIZATIONS.md):lines 77-82)

## 5. Data Validation and Integrity

While RLS handles access control, client-side validation and data integrity checks are still important.

*   **Input Validation**: Validate any data sent to the database from the patient app to prevent malformed or malicious input.
*   **Schema Adherence**: Ensure that data acquired from the database conforms to expected schemas and types.
    *   **Relevant Database Overview**: [`docs/architecture/databasexp.md`](docs/architecture/databasexp.md) provides a detailed overview of database tables and their key fields, which should be used as a reference for expected data structures.

## 6. Critical Dependencies and Modules

The patient-facing app's data acquisition relies heavily on the following:

*   **Supabase Client**: The primary library for interacting with the PostgreSQL database and its RLS policies.
*   **React Query**: Used for managing server state, caching, and simplifying data fetching logic.
*   **API Hooks**: Custom hooks (e.g., in `src/apis/`) that encapsulate the logic for interacting with specific data entities.
*   **Database Schema**: The underlying database structure, as detailed in [`docs/architecture/databasexp.md`](docs/architecture/databasexp.md), dictates the available data and relationships.

By adhering to these practices, the patient-facing app can ensure secure, efficient, and reliable data acquisition, providing a trustworthy experience for users.